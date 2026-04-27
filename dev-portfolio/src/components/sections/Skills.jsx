import { useEffect, useRef, useState, useCallback } from 'react'
import { SKILLS } from '../constants/data'

// ── Category config ────────────────────────────────────────────────────────────
const CAT_COLORS = {
  Frontend: { h: 250, pill: 'rgba(140,120,255,.15)', text: '#a89eff', stroke: 'rgba(140,120,255,.5)' },
  Backend:  { h: 165, pill: 'rgba(50,220,180,.12)',  text: '#3ddbb5', stroke: 'rgba(50,220,180,.5)'  },
  DevOps:   { h: 5,   pill: 'rgba(255,90,100,.12)',  text: '#ff7a85', stroke: 'rgba(255,90,100,.5)'  },
  Tools:    { h: 38,  pill: 'rgba(255,180,60,.12)',  text: '#ffbf4a', stroke: 'rgba(255,180,60,.5)'  },
}

function hsl(h, s, l, a = 1) {
  return `hsla(${h},${s}%,${l}%,${a})`
}

// ── Node class (lives outside React render) ────────────────────────────────────
class OrbitalNode {
  constructor(name, cat, W, H) {
    this.name = name
    this.cat  = cat
    this.col  = CAT_COLORS[cat]
    this.r    = Math.random() * Math.min(W, H) * 0.32 + 60
    this.angle = Math.random() * Math.PI * 2
    this.speed = (Math.random() * 0.0008 + 0.0003) * (Math.random() < 0.5 ? 1 : -1)
    this.wobble      = Math.random() * Math.PI * 2
    this.wobbleSpeed = Math.random() * 0.02 + 0.005
    this.size = Math.random() * 4 + 20
    this.x  = W / 2 + Math.cos(this.angle) * this.r
    this.y  = H / 2 + Math.sin(this.angle) * this.r
    this.px = this.x
    this.py = this.y
    this.vx = 0
    this.vy = 0
    this.alpha       = 0
    this.targetAlpha = 1
    this.scale       = 0
    this.targetScale = 1
    this.trail    = []
    this.pulse    = Math.random() * Math.PI * 2
    this.glowAmt  = 0
    this.born     = 0
  }

  update(frame, mouse, activeFilter, W, H) {
    this.targetAlpha = (activeFilter && this.cat !== activeFilter) ? 0.08 : 1
    this.targetScale = (activeFilter && this.cat !== activeFilter) ? 0.7  : 1
    this.alpha += (this.targetAlpha - this.alpha) * 0.06
    this.scale += (this.targetScale - this.scale) * 0.06

    this.angle  += this.speed
    this.wobble += this.wobbleSpeed

    const bx   = W / 2 + Math.cos(this.angle) * this.r
    const by   = H / 2 + Math.sin(this.angle) * this.r
    const wobX = Math.cos(this.wobble * 1.3) * 12
    const wobY = Math.sin(this.wobble) * 8
    const tx   = bx + wobX
    const ty   = by + wobY

    const dx   = mouse.x - tx
    const dy   = mouse.y - ty
    const dist = Math.sqrt(dx * dx + dy * dy)

    let fx = 0, fy = 0
    if (dist < 140 && dist > 0) {
      const force = (140 - dist) / 140
      fx -= (dx / dist) * force * 2.5
      fy -= (dy / dist) * force * 2.5
    }

    this.vx = (this.vx + (tx + fx - this.x) * 0.08) * 0.82
    this.vy = (this.vy + (ty + fy - this.y) * 0.08) * 0.82
    this.px = this.x
    this.py = this.y
    this.x += this.vx
    this.y += this.vy

    this.pulse += 0.04

    if (frame - this.born > 10) {
      this.trail.push({ x: this.x, y: this.y, a: this.alpha * 0.4 })
      if (this.trail.length > 14) this.trail.shift()
    }

    this.glowAmt = dist < 90
      ? Math.min(this.glowAmt + 0.08, 1)
      : Math.max(this.glowAmt - 0.05, 0)
  }

  draw(ctx) {
    const { h } = this.col
    const s = this.scale

    // Trail
    if (this.trail.length > 2) {
      for (let i = 1; i < this.trail.length; i++) {
        const t  = this.trail[i]
        const pt = this.trail[i - 1]
        const prog = i / this.trail.length
        ctx.beginPath()
        ctx.moveTo(pt.x, pt.y)
        ctx.lineTo(t.x, t.y)
        ctx.strokeStyle = hsl(h, 70, 65, prog * 0.18 * this.alpha)
        ctx.lineWidth   = prog * 3 * s
        ctx.stroke()
      }
    }

    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(s, s)

    const pulse = 1 + Math.sin(this.pulse) * 0.06

    // Glow halo
    if (this.glowAmt > 0) {
      const g = ctx.createRadialGradient(0, 0, this.size * 0.5, 0, 0, this.size * 3)
      g.addColorStop(0, hsl(h, 80, 65, this.glowAmt * 0.35 * this.alpha))
      g.addColorStop(1, hsl(h, 80, 65, 0))
      ctx.beginPath()
      ctx.arc(0, 0, this.size * 3, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }

    // Node body
    ctx.beginPath()
    ctx.arc(0, 0, this.size * 1.5 * pulse, 0, Math.PI * 2)
    ctx.fillStyle   = hsl(h, 60, 8, this.alpha * 0.9)
    ctx.strokeStyle = hsl(h, 75, 65, this.alpha * (0.4 + this.glowAmt * 0.5))
    ctx.lineWidth   = 1.2
    ctx.fill()
    ctx.stroke()

    // Inner gradient sheen
    ctx.beginPath()
    ctx.arc(0, 0, this.size * 1.5 * pulse, 0, Math.PI * 2)
    const grad = ctx.createRadialGradient(-this.size * 0.3, -this.size * 0.3, 0, 0, 0, this.size * 1.5)
    grad.addColorStop(0, hsl(h, 70, 80, this.alpha * 0.25))
    grad.addColorStop(1, hsl(h, 80, 50, this.alpha * 0.05))
    ctx.fillStyle = grad
    ctx.fill()

    // Label
    ctx.fillStyle    = hsl(h, 30, 90, this.alpha * (0.75 + this.glowAmt * 0.25))
    ctx.font         = `${Math.round(this.size * 0.72)}px 'Courier New', monospace`
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.name, 0, 0)

    ctx.restore()
  }
}

// ── Tooltip component ──────────────────────────────────────────────────────────
function Tooltip({ node, mouseX, mouseY, W, H }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  if (!node) return null
  const col = CAT_COLORS[node.cat]
  let tx = mouseX + 18
  let ty = mouseY - 10
  if (tx + 140 > W - 8) tx = mouseX - 150
  if (ty + 36  > H - 8) ty = mouseY - 40

  return (
    <div
      style={{
        position:    'absolute',
        left:        tx,
        top:         ty,
        pointerEvents: 'none',
        fontFamily:  "'Courier New', monospace",
        fontSize:    '11px',
        padding:     '6px 12px',
        borderRadius: '8px',
        background: 'var(--card-bg)',
        border:      `1px solid ${col.stroke}`,
        color:       col.text,
        whiteSpace:  'nowrap',
        zIndex:      20,
        letterSpacing: '.05em',
        userSelect:  'none',
      }}
    >
      <span style={{ opacity: .5 }}>{node.cat}</span>
      {' · '}
      {node.name}
    </div>
  )
}

// ── Category filter pills ──────────────────────────────────────────────────────
function CatPills({ activeFilter, onFilter }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
      {/* ALL */}
      <button
        onClick={() => onFilter(null)}
        style={{
          fontFamily:  "'Courier New', monospace",
          fontSize:    '10px',
          padding:     '4px 10px',
          borderRadius: '20px',
          letterSpacing: '.1em',
          cursor:      'pointer',
          border: '1px solid var(--border)',
          background: activeFilter === null ? 'var(--tag-bg)' : 'transparent',
          color: activeFilter === null ? 'var(--text)' : 'var(--muted)',
          transition:  'all .25s',
          outline:     'none',
        }}
      >
        ALL
      </button>

      {Object.keys(CAT_COLORS).map(cat => {
        const c      = CAT_COLORS[cat]
        const active = activeFilter === cat
        return (
          <button
            key={cat}
            onClick={() => onFilter(active ? null : cat)}
            style={{
              fontFamily:  "'Courier New', monospace",
              fontSize:    '10px',
              padding:     '4px 10px',
              borderRadius: '20px',
              letterSpacing: '.1em',
              cursor:      'pointer',
              border: `1px solid ${active ? c.stroke : 'var(--border)'}`,
              background: active ? c.pill : 'transparent',
              color: active ? c.text : 'var(--muted)',
              transition:  'all .25s',
              outline:     'none',
            }}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}

// ── Main SkillsSection ─────────────────────────────────────────────────────────
export default function SkillsSection() {
  const wrapRef        = useRef(null)
  const canvasRef      = useRef(null)
  const stateRef       = useRef({
    nodes:        [],
    mouse:        { x: -9999, y: -9999 },
    activeFilter: null,
    frame:        0,
    raf:          null,
    W:            0,
    H:            0,
    hoveredNode:  null,
  })

  const [activeFilter, setActiveFilter]  = useState(null)
  const [hoveredNode,  setHoveredNode]   = useState(null)
  const [mousePos,     setMousePos]      = useState({ x: 0, y: 0 })
  const [dims,         setDims]          = useState({ W: 0, H: 0 })
  const [showCursor,   setShowCursor]    = useState(false)

  // ── Resize ───────────────────────────────────────────────────────────────────
  const resize = useCallback(() => {
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const W = wrap.clientWidth || 680
    const H = Math.min(Math.max(W * 0.65, 340), 520)

    canvas.width  = W * devicePixelRatio
    canvas.height = H * devicePixelRatio
    canvas.style.width  = W + 'px'
    canvas.style.height = H + 'px'

    const ctx = canvas.getContext('2d')
    ctx.scale(devicePixelRatio, devicePixelRatio)

    const s = stateRef.current
    s.W = W
    s.H = H
    s.nodes.forEach(n => { n.r = Math.random() * Math.min(W, H) * 0.32 + 60 })
    setDims({ W, H })
  }, [])

  // ── Init nodes ───────────────────────────────────────────────────────────────
  const initNodes = useCallback(() => {
    const { W, H } = stateRef.current
    const nodes = []
    Object.entries(SKILLS).forEach(([cat, skills]) => {
      skills.forEach(item => {
        // SKILLS can be array of strings OR array of {name,level} objects
        const name = typeof item === 'string' ? item : item.name
        nodes.push(new OrbitalNode(name, cat, W, H))
      })
    })
    stateRef.current.nodes = nodes
  }, [])

  // ── Draw helpers ─────────────────────────────────────────────────────────────
  const drawOrbits = useCallback((ctx, W, H) => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const rings = [0.12, 0.22, 0.33, 0.43]
    rings.forEach((r, i) => {
      const rad = Math.min(W, H) * r
      ctx.beginPath()
      ctx.arc(W / 2, H / 2, rad, 0, Math.PI * 2)
      ctx.strokeStyle = isDark
      ? `rgba(255,255,255,${0.025 + i * 0.005})`
      : `rgba(0,0,0,${0.05 + i * 0.01})`
      ctx.lineWidth   = 0.5
      ctx.setLineDash([3, 12])
      ctx.stroke()
      ctx.setLineDash([])
    })
  }, [])

  const drawCenter = useCallback((ctx, W, H, frame) => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    ctx.save()
    ctx.translate(W / 2, H / 2)
    const t = frame * 0.008

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 28)
    g.addColorStop(0, isDark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)')
    g.addColorStop(1, isDark ? 'rgba(255,255,255,.7)'  : 'rgba(0,0,0,.7)')
    ctx.beginPath()
    ctx.arc(0, 0, 28, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()

    for (let k = 0; k < 4; k++) {
      ctx.beginPath()
      const a = t + k * Math.PI / 2
      ctx.moveTo(Math.cos(a) * 6,  Math.sin(a) * 6)
      ctx.lineTo(Math.cos(a) * 22, Math.sin(a) * 22)
      ctx.strokeStyle = `rgba(255,255,255,${0.15 + Math.sin(t * 3 + k) * 0.06})`
      ctx.lineWidth   = 1
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(0, 0, 5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,.7)'
    ctx.fill()
    ctx.restore()
  }, [])

  const drawConnections = useCallback((ctx, nodes) => {
    const R = 160
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i]
      if (a.glowAmt < 0.01) continue
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j]
        if (b.glowAmt < 0.01 || a.cat !== b.cat) continue
        const dx = b.x - a.x, dy = b.y - a.y
        const d  = Math.sqrt(dx * dx + dy * dy)
        if (d < R) {
          const strength = Math.min(a.glowAmt, b.glowAmt) * (1 - d / R)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = hsl(a.col.h, 70, 65, strength * 0.4)
          ctx.lineWidth   = strength * 1.5
          ctx.stroke()
        }
      }
    }
  }, [])

  const findHovered = useCallback((nodes, mouse, activeFilter) => {
    let best = null, bd = 99999
    nodes.forEach(n => {
      if (activeFilter && n.cat !== activeFilter) return
      const dx = n.x - mouse.x, dy = n.y - mouse.y
      const d  = Math.sqrt(dx * dx + dy * dy)
      if (d < n.size * 1.8 && d < bd) { bd = d; best = n }
    })
    return best
  }, [])

  // ── Animation loop ───────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const s   = stateRef.current
    const { nodes, mouse, activeFilter, W, H } = s

    s.frame++
    const frame = s.frame

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = isDark
    ? 'rgba(10,10,15,.92)'
    : 'rgba(255,255,255,.9)'
    ctx.fillRect(0, 0, W, H)

    drawOrbits(ctx, W, H)
    drawCenter(ctx, W, H, frame)
    drawConnections(ctx, nodes)

    nodes.forEach(n => n.update(frame, mouse, activeFilter, W, H))
    nodes.sort((a, b) => a.y - b.y)
    nodes.forEach(n => n.draw(ctx))

    const hovered = findHovered(nodes, mouse, activeFilter)
    if (hovered !== s.hoveredNode) {
      s.hoveredNode = hovered
      setHoveredNode(hovered ? { ...hovered } : null)
    } else if (hovered) {
      // keep tooltip position fresh
      setMousePos(prev => ({ ...prev }))
    }

    s.raf = requestAnimationFrame(loop)
  }, [drawOrbits, drawCenter, drawConnections, findHovered])

  // ── Mouse / touch ────────────────────────────────────────────────────────────
  const getPos = (e) => {
    const r   = wrapRef.current.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return { x: src.clientX - r.left, y: src.clientY - r.top }
  }

  const onMove = useCallback((e) => {
    const p = getPos(e)
    stateRef.current.mouse = p
    setMousePos(p)
    setShowCursor(true)
  }, [])

  const onLeave = useCallback(() => {
    stateRef.current.mouse = { x: -9999, y: -9999 }
    setHoveredNode(null)
    setShowCursor(false)
  }, [])

  const onTouchEnd = useCallback(() => {
    stateRef.current.mouse = { x: -9999, y: -9999 }
  }, [])

  // ── Filter sync ───────────────────────────────────────────────────────────────
  const handleFilter = useCallback((cat) => {
    setActiveFilter(cat)
    stateRef.current.activeFilter = cat
  }, [])

  // ── Mount / unmount ───────────────────────────────────────────────────────────
  useEffect(() => {
    resize()
    initNodes()
    stateRef.current.raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(resize)
    if (wrapRef.current) ro.observe(wrapRef.current)

    return () => {
      cancelAnimationFrame(stateRef.current.raf)
      ro.disconnect()
    }
  }, []) // eslint-disable-line

  const totalSkills = Object.values(SKILLS).flat().length

  return (
    <section
      id="skills"
      aria-label="Skills"
      style={{
        padding: 'clamp(50px, 8vw, 90px) clamp(20px, 5vw, 48px) clamp(50px, 8vw, 90px)',
        background: 'var(--surface)',
        position:  'relative',
        overflow:  'hidden',
      }}
    >
      {/* Section label */}
      <div style={{
        fontFamily:     "'Courier New', monospace",
        fontSize:       '12px',
        letterSpacing:  '.25em',
        textTransform:  'uppercase',
        color:          'var(--muted)',
        marginBottom:   '24px',
        display:        'flex',
        alignItems:     'center',
        gap:            '12px',
      }}>
        <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--primary)' }} />
        02 / Skills
      </div>

      {/* Heading */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontFamily:     'Syne, sans-serif',
          fontSize:       'clamp(28px, 4vw, 48px)',
          fontWeight:     800,
          letterSpacing:  '-1px',
          lineHeight:     1.1,
          margin:         '0 0 12px',
          color:          'var(--text)',
        }}>
          What I work with
        </h2>
        <p style={{
          fontFamily: 'Cabinet Grotesk, sans-serif',
          fontSize:   '15px',
          lineHeight: 1.7,
          color:      'var(--muted)',
          margin:     0,
          maxWidth:   '420px',
        }}>
          Hover to magnetise · filter by category · watch them orbit
        </p>
      </div>

      {/* Canvas wrapper */}
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onTouchMove={onMove}
        onTouchEnd={onTouchEnd}
        style={{
          position:     'relative',
          width:        '98%',
          overflow:     'hidden',
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          cursor:       'none',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block' }} />

        {/* HUD overlay */}
        <div style={{
          position:      'absolute',
          top:           '16px',
          left:          '16px',
          right:         '16px',
          display:       'flex',
          justifyContent: 'space-between',
          alignItems:    'flex-start',
          pointerEvents: 'none',
          zIndex:        10,
        }}>
          {/* Left label */}
          <div style={{ pointerEvents: 'none' }}>
            <div style={{
              fontFamily:    "'Courier New', monospace",
              fontSize:      '11px',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}>
              Tech Stack
            </div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize:   '9px',
              color:      'var(--muted)',
              opacity: 0.6,
              marginTop:  '3px',
            }}>
              {totalSkills} technologies
            </div>
          </div>

          {/* Category pills */}
          <div style={{ pointerEvents: 'all' }}>
            <CatPills activeFilter={activeFilter} onFilter={handleFilter} />
          </div>
        </div>

        {/* Tooltip */}
        {hoveredNode && (
          <Tooltip
            node={hoveredNode}
            mouseX={mousePos.x}
            mouseY={mousePos.y}
            W={dims.W}
            H={dims.H}
          />
        )}

        {/* Custom crosshair cursor */}
        {showCursor && (
          <div
            style={{
              position:       'absolute',
              left:           mousePos.x,
              top:            mousePos.y,
              width:          '24px',
              height:         '24px',
              marginLeft:     '-12px',
              marginTop:      '-12px',
              pointerEvents:  'none',
              zIndex:         30,
              transform:      hoveredNode ? 'scale(1.4)' : 'scale(1)',
              transition:     'transform .15s ease',
            }}
          >
            <div style={{
              position:   'absolute',
              width:      '1px',
              height:     '100%',
              left:       '50%',
              top:        0,
              background: hoveredNode
                ? CAT_COLORS[hoveredNode.cat].text
                : 'var(--muted)',
              transition: 'background .2s',
            }} />
            <div style={{
              position:   'absolute',
              width:      '100%',
              height:     '1px',
              top:        '50%',
              left:       0,
              background: hoveredNode
                ? CAT_COLORS[hoveredNode.cat].text
                : 'var(--muted)',
              transition: 'background .2s',
            }} />
          </div>
        )}
      </div>
    </section>
  )
}