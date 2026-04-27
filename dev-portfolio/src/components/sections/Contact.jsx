import { useRef, useState, useEffect, useCallback, useReducer, useContext } from 'react'
import { ThemeContext } from '../../hooks/ThemeProvider'
import emailjs from "@emailjs/browser"

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — tweak to taste
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT_CONFIG = {
  email:    'sujitshaw029@gmail.com',
  location: 'Kolkata, India',
  // lat/lng for the pin
  pinLat:   22.5726,
  pinLng:   88.3639,
  socials: [
    { label: 'GitHub',   href: 'https://github.com/sujit-27'        },
    { label: 'Instagram',  href: 'https://instagram.com/sujit.815'       },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/sujit-kumar-shaw'   },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// useScrollReveal
// ─────────────────────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

// ─────────────────────────────────────────────────────────────────────────────
// 3-D GLOBE — pure Canvas, no library
// ─────────────────────────────────────────────────────────────────────────────
function Globe({ size }) {
  const cvRef   = useRef(null)
  const state   = useRef({
    rotY:   0.4, rotX: -0.2,
    dY: 0.003, dX: 0,
    dragging: false,
    lastX: 0, lastY: 0,
    frame: 0,
    raf: null,
  })

  // lat/lng → 3-D unit sphere point
  const ll2xyz = (lat, lng, r = 1) => {
    const φ = (lat * Math.PI) / 180
    const λ = (lng * Math.PI) / 180
    return [
      r * Math.cos(φ) * Math.cos(λ),
      r * Math.sin(φ),
      r * Math.cos(φ) * Math.sin(λ),
    ]
  }

  // rotate point by Y then X
  const rotate = ([x, y, z], ry, rx) => {
    // Y-axis
    const x1 =  x * Math.cos(ry) + z * Math.sin(ry)
    const z1 = -x * Math.sin(ry) + z * Math.cos(ry)
    // X-axis
    const y2 =  y * Math.cos(rx) - z1 * Math.sin(rx)
    const z2 =  y * Math.sin(rx) + z1 * Math.cos(rx)
    return [x1, y2, z2]
  }

  // project 3-D → 2-D
  const project = ([x, y, z], cx, cy, r) => {
    const fov  = 2.8
    const scale = r * fov / (fov + z + 1)
    return [cx + x * scale, cy - y * scale, z]
  }

  useEffect(() => {
    const cv  = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const DPR = devicePixelRatio || 1
    const S   = size
    cv.width  = S * DPR
    cv.height = S * DPR
    cv.style.width  = S + 'px'
    cv.style.height = S + 'px'
    ctx.scale(DPR, DPR)

    const cx = S / 2, cy = S / 2, R = S * 0.38

    // Build dot grid (latitude / longitude every 15°)
    const dots = []
    for (let lat = -90; lat <= 90; lat += 15) {
      for (let lng = -180; lng < 180; lng += 15) {
        dots.push(ll2xyz(lat, lng, 1))
      }
    }

    // Dense dots for continents (simplified bounding boxes)
    const landBoxes = [
      // N.America
      { latMin: 10, latMax: 72, lngMin: -170, lngMax: -52,  step: 7 },
      // S.America
      { latMin: -55, latMax: 14, lngMin: -82, lngMax: -34,  step: 7 },
      // Europe
      { latMin: 35, latMax: 72, lngMin: -12, lngMax: 45,    step: 6 },
      // Africa
      { latMin: -35, latMax: 38, lngMin: -18, lngMax: 52,   step: 7 },
      // Asia
      { latMin: 0, latMax: 77, lngMin: 26, lngMax: 145,     step: 6 },
      // Australia
      { latMin: -44, latMax: -10, lngMin: 112, lngMax: 155, step: 7 },
    ]
    const landDots = []
    landBoxes.forEach(({ latMin, latMax, lngMin, lngMax, step }) => {
      for (let lat = latMin; lat <= latMax; lat += step) {
        for (let lng = lngMin; lng <= lngMax; lng += step) {
          landDots.push(ll2xyz(lat, lng, 1))
        }
      }
    })

    // Arc connections (random city pairs, decorative)
    const cities = [
      ll2xyz(40.7, -74.0, 1),  // New York
      ll2xyz(51.5, -0.12, 1),  // London
      ll2xyz(48.8,  2.35, 1),  // Paris
      ll2xyz(35.6, 139.7, 1),  // Tokyo
      ll2xyz(22.5,  88.4, 1),  // Kolkata ← you
      ll2xyz(-33.9, 18.4, 1),  // Cape Town
      ll2xyz(37.8, -122.4, 1), // San Francisco
      ll2xyz(1.35,  103.8, 1), // Singapore
      ll2xyz(-23.5, -46.6, 1), // São Paulo
      ll2xyz(55.7,  37.6, 1),  // Moscow
      ll2xyz(19.1,  72.9, 1),  // Mumbai
      ll2xyz(31.2,  121.5, 1), // Shanghai
    ]
    const arcs = [
      [4, 1], [4, 3], [4, 7], // Kolkata → London, Tokyo, Singapore
      [0, 6], [0, 1], [0, 2], // NY → SF, London, Paris
      [1, 5], [2, 8], [3, 11],// London → Cape Town, Paris → São Paulo, Tokyo → Shanghai
      [6, 9], [7, 11], [10, 7],
    ]

    // Arc interpolation
    function interpArc(a, b, t) {
      // Slerp on unit sphere
      const dot = a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
      const θ   = Math.acos(Math.min(Math.max(dot, -1), 1))
      if (θ < 0.0001) return a
      const s = Math.sin(θ)
      return [
        (Math.sin((1-t)*θ)/s)*a[0] + (Math.sin(t*θ)/s)*b[0],
        (Math.sin((1-t)*θ)/s)*a[1] + (Math.sin(t*θ)/s)*b[1],
        (Math.sin((1-t)*θ)/s)*a[2] + (Math.sin(t*θ)/s)*b[2],
      ]
    }

    // Arc animated head
    const arcHeads = arcs.map(() => ({ t: Math.random(), speed: 0.003 + Math.random() * 0.003 }))

    const s = state.current

    function draw() {
      s.raf   = requestAnimationFrame(draw)
      s.frame++
      if (!s.dragging) {
        s.rotY += s.dY
        s.rotX += (0 - s.rotX) * 0.02  // drift back to equator
      }

      ctx.clearRect(0, 0, S, S)

      // ── Glow backdrop
      const glow = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.1)
      glow.addColorStop(0,   'rgba(108,99,255,0.06)')
      glow.addColorStop(0.5, 'rgba(0,217,181,0.03)')
      glow.addColorStop(1,   'rgba(10,10,15,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // ── Outer ring
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'
      ctx.lineWidth   = 0.8
      ctx.stroke()

      // ── Grid dots (lat/lng lines)
      dots.forEach(pt => {
        const [rx, ry, rz] = rotate(pt, s.rotY, s.rotX)
        const [px, py]     = project([rx, ry, rz], cx, cy, R)
        const vis  = (rz + 1) / 2          // 0 (back) → 1 (front)
        if (vis < 0.05) return
        ctx.beginPath()
        ctx.arc(px, py, 0.9, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${vis * 0.13})`
        ctx.fill()
      })

      // ── Land dots (brighter)
      landDots.forEach(pt => {
        const [rx, ry, rz] = rotate(pt, s.rotY, s.rotX)
        const [px, py]     = project([rx, ry, rz], cx, cy, R)
        const vis = (rz + 1) / 2
        if (vis < 0.05) return
        ctx.beginPath()
        ctx.arc(px, py, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(160,150,255,${vis * 0.55})`
        ctx.fill()
      })

      // ── Arc lines
      arcs.forEach(([ai, bi], idx) => {
        const a   = cities[ai]
        const b   = cities[bi]
        const head = arcHeads[idx]
        head.t = (head.t + head.speed) % 1

        const STEPS = 48
        let prevVis = false;
        let prevPx = 0;
        let prevPy = 0;

        for (let i = 0; i <= STEPS; i++) {
          const t    = i / STEPS
          const pt   = interpArc(a, b, t)
          const lift = 1 + 0.22 * Math.sin(Math.PI * t) // arc lift above sphere
          const liftPt = [pt[0] * lift, pt[1] * lift, pt[2] * lift]
          const [rx, ry, rz] = rotate(liftPt, s.rotY, s.rotX)
          const [px, py]     = project([rx, ry, rz], cx, cy, R)
          const vis = (rz + 1) / 2

          const distToHead = Math.abs(t - head.t)
          const glow2 = Math.max(0, 1 - distToHead * 14)
          const baseA  = vis * 0.28
          const totalA = baseA + glow2 * 0.55

          if (i > 0 && vis > 0.05 && prevVis) {
            ctx.beginPath()
            ctx.moveTo(prevPx, prevPy)
            ctx.lineTo(px, py)
            ctx.strokeStyle = `rgba(0,217,181,${totalA})`
            ctx.lineWidth   = 0.8 + glow2 * 1.4
            ctx.stroke()
          }
          prevPx = px; prevPy = py; prevVis = vis > 0.05
        }
      })

      // ── City dots
      cities.forEach((pt, i) => {
        const [rx, ry, rz] = rotate(pt, s.rotY, s.rotX)
        const [px, py]     = project([rx, ry, rz], cx, cy, R)
        const vis = (rz + 1) / 2
        if (vis < 0.08) return

        const isHome = i === 4  // Kolkata
        const pulse  = isHome ? 1 + Math.sin(s.frame * 0.06) * 0.4 : 1

        if (isHome) {
          // Pulsing halo
          ctx.beginPath()
          ctx.arc(px, py, 7 * pulse * vis, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,217,181,${vis * 0.15 * pulse})`
          ctx.fill()

          ctx.beginPath()
          ctx.arc(px, py, 4 * vis, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,217,181,${vis * 0.9})`
          ctx.fill()

          // Label
          ctx.fillStyle    = `rgba(0,217,181,${vis * 0.8})`
          ctx.font         = `${Math.round(9 * vis)}px 'Courier New', monospace`
          ctx.textAlign    = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText('YOU', px + 7 * vis, py)
        } else {
          ctx.beginPath()
          ctx.arc(px, py, 2 * vis, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${vis * 0.55})`
          ctx.fill()
        }
      })

      // ── Rim / atmosphere
      const rim = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.02)
      rim.addColorStop(0, 'rgba(108,99,255,0)')
      rim.addColorStop(1, 'rgba(108,99,255,0.12)')
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2)
      ctx.fillStyle = rim
      ctx.fill()
    }

    draw()

    return () => cancelAnimationFrame(s.raf)
  }, [size])

  // Drag to spin
  const onDown = (e) => {
    const s = state.current
    s.dragging = true
    s.lastX = e.touches ? e.touches[0].clientX : e.clientX
    s.lastY = e.touches ? e.touches[0].clientY : e.clientY
  }
  const onMove = (e) => {
    const s = state.current
    if (!s.dragging) return
    const cx = e.touches ? e.touches[0].clientX : e.clientX
    const cy2 = e.touches ? e.touches[0].clientY : e.clientY
    const dx = cx - s.lastX
    const dy = cy2 - s.lastY
    s.rotY += dx * 0.008
    s.rotX += dy * 0.006
    s.rotX  = Math.max(-1.2, Math.min(1.2, s.rotX))
    s.dY    = dx * 0.0004
    s.lastX = cx
    s.lastY = cy2
  }
  const onUp = () => { state.current.dragging = false }

  return (
    <canvas
      ref={cvRef}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
      style={{ cursor: 'grab', display: 'block', borderRadius: '50%' }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Glowing input / textarea
// ─────────────────────────────────────────────────────────────────────────────
function GlowField({
  label,
  name,
  type = 'text',
  multiline = false,
  value,
  onChange,
  error,
  theme = 'dark',
}) {
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0
  const Tag = multiline ? 'textarea' : 'input'

  const isDark = theme === 'dark'

  return (
    <div style={{ position: 'relative', marginBottom: '10px' }}>
      
      {/* Glow border */}
      <div
        style={{
          position: 'absolute',
          inset: '-1px',
          borderRadius: '12px',

          background: focused
            ? 'linear-gradient(135deg, rgba(108,99,255,.7), rgba(0,217,181,.5))'
            : error
            ? 'rgba(255,90,100,.4)'
            : isDark
            ? 'rgba(255,255,255,.06)'
            : 'rgba(0,0,0,.08)',

          filter: focused ? 'blur(2px)' : 'none',
          opacity: focused ? 1 : 0.8,

          transition: 'all .3s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main field container */}
      <div
        style={{
          position: 'relative',
          borderRadius: '12px',

          background: isDark
            ? 'var(--card-bg)'
            : '#ffffff', 

          border: isDark
            ? 'none'
            : '1px solid rgba(0,0,0,0.08)',

          boxShadow: focused
            ? isDark
              ? '0 0 25px rgba(108,99,255,0.25)'
              : '0 8px 25px rgba(108,99,255,0.12)' 
            : !isDark
            ? '0 4px 12px rgba(0,0,0,0.06)'
            : 'none',

          overflow: 'hidden',
          zIndex: 1,
          transition: 'all .25s ease',
        }}
      >
        {/* Floating label */}
        <label
          style={{
            position: 'absolute',
            left: '16px',
            top: multiline ? '14px' : '50%',
            transform:
            focused || filled
              ? multiline
                ? 'translateY(-60%) scale(.78)' 
                : 'translateY(-120%) scale(.78)'
              : multiline
              ? 'translateY(0)'
              : 'translateY(-50%)',
            transformOrigin: 'left center',
            fontFamily: "'Courier New', monospace",
            fontSize: '11px',
            letterSpacing: '.12em',
            textTransform: 'uppercase',

            color: focused
              ? '#6c63ff'
              : error
              ? '#ff5e6c'
              : isDark
              ? 'rgba(255,255,255,.35)'
              : 'rgba(0,0,0,.65)',

            transition: 'all .22s cubic-bezier(.23,1,.32,1)',
            pointerEvents: 'none',
            zIndex: 3, 
          }}
        >
          {label}
        </label>

        {/* Input */}
        <Tag
          name={name}
          type={type}
          value={value}
          rows={multiline ? 5 : undefined}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            display: 'block',
            width: '100%',
            padding: multiline
              ? '28px 16px 14px'
              : '22px 16px 10px',

            background: 'transparent',
            border: 'none',
            outline: 'none',

            fontFamily: 'Cabinet Grotesk, sans-serif',
            fontSize: '15px',
            color: isDark ? '#fff' : '#111', 
            position: 'relative',
            zIndex: 2, 
            resize: multiline ? 'none' : undefined,
            lineHeight: 1.6,
            caretColor: '#6c63ff',
          }}
        />

        {/* Shimmer */}
        {focused && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              opacity: isDark ? 0.6 : 0.4, 
              background: isDark
                ? 'linear-gradient(90deg, transparent, rgba(108,99,255,.04), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(108,99,255,.08), transparent)',
              backgroundSize: '200% 100%',
              animation: 'fieldShimmer 1.8s ease infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Error */}
      {error && (
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '10px',
            color: '#ff5e6c',
            marginTop: '6px',
            letterSpacing: '.08em',
          }}
        >
          ↑ {error}
        </p>
      )}
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────
// Magnetic send button
// ─────────────────────────────────────────────────────────────────────────────
function SendButton({ state: fState, onClick }) {
  const btnRef = useRef(null)
  const [mag, setMag] = useState({ x: 0, y: 0 })
  const [hov, setHov] = useState(false)

  const onMove = (e) => {
    const r  = btnRef.current.getBoundingClientRect()
    const cx = r.left + r.width  / 2
    const cy = r.top  + r.height / 2
    const dx = (e.clientX - cx) * 0.35
    const dy = (e.clientY - cy) * 0.35
    setMag({ x: dx, y: dy })
  }
  const onLeave = () => { setMag({ x: 0, y: 0 }); setHov(false) }

  const label = fState === 'sending' ? 'Transmitting…'
              : fState === 'sent'    ? 'Message received ✓'
              : fState === 'error'   ? 'Failed — retry'
              : 'Send message'

  const bg = fState === 'sent'  ? 'linear-gradient(135deg, #00d9b5, #00b5a0)'
           : fState === 'error' ? 'linear-gradient(135deg, #ff5e6c, #cc3344)'
           : 'linear-gradient(135deg, #6c63ff, #00d9b5)'

  return (
    <button
      ref={btnRef}
      type="button"
      disabled={fState === 'sending' || fState === 'sent'}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '10px',
        width:          '100%',
        padding:        '16px 28px',
        borderRadius:   '12px',
        border:         'none',
        background:     bg,
        color:          'var(--text)',
        fontFamily:     "'Courier New', monospace",
        fontSize:       '12px',
        letterSpacing:  '.18em',
        textTransform:  'uppercase',
        cursor:         fState === 'sent' ? 'default' : 'pointer',
        outline:        'none',
        transform:      `translate(${mag.x}px, ${mag.y}px) scale(${hov && fState === 'idle' ? 1.03 : 1})`,
        transition:     'transform .25s cubic-bezier(.23,1,.32,1), box-shadow .25s ease, background .4s ease',
        boxShadow:      hov
          ? '0 16px 40px rgba(108,99,255,.45), 0 0 0 1px rgba(255,255,255,.1)'
          : '0 8px 24px rgba(108,99,255,.25)',
        opacity:        fState === 'sending' ? 0.7 : 1,
      }}
    >
      {fState === 'sending' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="2.5"/>
          <path d="M12 2 A10 10 0 0 1 22 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ) : fState === 'sent' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {label}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ContactSection
// ─────────────────────────────────────────────────────────────────────────────
const INIT = { name: '', email: '', message: '' }
const ERRS = { name: '', email: '', message: '' }

export default function ContactSection() {
  const [sectionRef, isVisible] = useScrollReveal(0.07)
  const [fields,  setFields]    = useState(INIT)
  const [errors,  setErrors]    = useState(ERRS)
  const [fState,  setFState]    = useState('idle') // idle | sending | sent | error
  const [globeSize, setGlobeSize] = useState(380)
  const wrapRef = useRef(null)
  const { theme } = useContext(ThemeContext);

  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey  = import.meta.env.VITE_EMAILJS_API_KEY

  // Responsive globe size
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      setGlobeSize(w < 500 ? 260 : w < 900 ? 300 : 380)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const onChange = (e) => {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  const validate = () => {
    const e = { ...ERRS }
    if (!fields.name.trim())                          e.name    = 'name is required'
    if (!fields.email.trim())                         e.email   = 'email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'invalid email'
    if (fields.message.trim().length < 10)            e.message = 'tell me a bit more'
    return e
  }

  const handleSend = async () => {
    const e = validate()
    if (Object.values(e).some(Boolean)) {
      setErrors(e)
      return
    }

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS ENV missing")
      setFState('error')
      return
    }

    setFState('sending')

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: fields.name,
          email: fields.email,
          message: fields.message,
        },
        publicKey
      )

      setFState('sent')
      setFields(INIT)

    } catch (err) {
      console.error("Email error:", err)
      setFState('error')

      // optional: reset back to idle after some time
      setTimeout(() => setFState('idle'), 3000)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fieldShimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
        @keyframes spin {
          to { transform: rotate(360deg) }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px) }
          to   { opacity:1; transform:translateY(0)    }
        }
        @keyframes blink {
          0%,100% { opacity:1 } 50% { opacity:0 }
        }
      `}</style>

      <section
        id="contact"
        ref={sectionRef}
        aria-label="Contact"
        style={{
          padding: 'clamp(50px, 8vw, 90px) clamp(20px, 5vw, 48px)',
          background: 'var(--surface)',
          position:   'relative',
          overflow:   'hidden',
        }}
      >
        {/* Atmosphere */}
        <div aria-hidden style={{
          position: 'absolute', top: '-120px', left: '50%',
          transform: 'translateX(-50%)',
          width: '700px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(108,99,255,.07) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(108,99,255,.25), rgba(0,217,181,.2), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative' }}>

          {/* ── Label ─────────────────────────────────────────────── */}
          <div style={{
            fontFamily:    "'Courier New', monospace",
            fontSize:      '12px',
            letterSpacing: '.25em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom:  '24px',
            display:       'flex',
            alignItems:    'center',
            gap:           '12px',
            opacity:       isVisible ? 1 : 0,
            transform:     isVisible ? 'none' : 'translateY(14px)',
            transition:    'opacity .6s ease, transform .6s ease',
          }}>
            <span style={{
              display:    'inline-block',
              width:      isVisible ? '24px' : '0px',
              height:     '1px',
              background: '#6c63ff',
              transition: 'width .6s ease .2s',
            }} />
            04 / Contact
          </div>

          {/* ── Main heading ──────────────────────────────────────── */}
          <h2 style={{
            fontFamily:    'Syne, sans-serif',
            fontSize:      'clamp(32px, 5.5vw, 72px)',
            fontWeight:    800,
            letterSpacing: '-2px',
            lineHeight:    1.0,
            color:         'var(--text)',
            margin:        '0 0 60px',
            opacity:       isVisible ? 1 : 0,
            transform:     isVisible ? 'none' : 'translateY(20px)',
            transition:    'opacity .7s ease .1s, transform .7s ease .1s',
          }}>
            Let's build<br />
            <span style={{
              background:              'linear-gradient(135deg, #6c63ff, #00d9b5)',
              WebkitBackgroundClip:    'text',
              WebkitTextFillColor:     'transparent',
              backgroundClip:          'text',
            }}>
              something
            </span>{' '}
            <span style={{ color: 'rgba(255,255,255,.2)' }}>real.</span>
          </h2>

          {/* ── Two-column layout ─────────────────────────────────── */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap:                 'clamp(32px, 5vw, 72px)',
            alignItems:          'start',
          }}>

            {/* ── LEFT — Globe + info ─────────────────────────────── */}
            <div style={{
              opacity:    isVisible ? 1 : 0,
              transform:  isVisible ? 'none' : 'translateX(-30px)',
              transition: 'opacity .8s ease .2s, transform .8s ease .2s',
            }}>
              {/* Globe */}
              <div style={{
                display:        'flex',
                justifyContent: 'center',
                marginBottom:   '40px',
                position:       'relative',
              }}>
                {/* Glow behind globe */}
                <div style={{
                  position:     'absolute',
                  top: '50%', left: '50%',
                  transform:    'translate(-50%, -50%)',
                  width:        `${globeSize * 1.1}px`,
                  height:       `${globeSize * 1.1}px`,
                  borderRadius: '50%',
                  background:   'radial-gradient(circle, rgba(108,99,255,.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <Globe size={globeSize} />
              </div>

              {/* Info rows */}
              <div style={{
                display:       'flex',
                flexDirection: 'column',
                gap:           '16px',
                marginBottom:  '32px',
              }}>
                {[
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#6c63ff" strokeWidth="1.8"/>
                        <circle cx="12" cy="9" r="2.5" stroke="#6c63ff" strokeWidth="1.8"/>
                      </svg>
                    ),
                    label: 'Location',
                    value: CONTACT_CONFIG.location,
                  },
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#00d9b5" strokeWidth="1.8"/>
                        <polyline points="22,6 12,13 2,6" stroke="#00d9b5" strokeWidth="1.8"/>
                      </svg>
                    ),
                    label: 'Email',
                    value: CONTACT_CONFIG.email,
                    href:  `mailto:${CONTACT_CONFIG.email}`,
                  },
                  {
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#ffbf4a" strokeWidth="1.8"/>
                        <polyline points="12,6 12,12 16,14" stroke="#ffbf4a" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    ),
                    label: 'Response',
                    value: 'Within 24 hours',
                  },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} style={{
                    display:     'flex',
                    alignItems:  'center',
                    gap:         '14px',
                    padding:     '14px 16px',
                    borderRadius: '10px',
                    background: 'var(--tag-bg)',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{
                      width:          '32px',
                      height:         '32px',
                      borderRadius:   '8px',
                      background:     'rgba(255,255,255,.04)',
                      border:         '1px solid rgba(255,255,255,.06)',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      flexShrink:     0,
                    }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{
                        fontFamily:    "'Courier New', monospace",
                        fontSize:      '9px',
                        letterSpacing: '.15em',
                        textTransform: 'uppercase',
                        color: 'var(--muted)',
                        marginBottom:  '2px',
                      }}>
                        {label}
                      </div>
                      {href ? (
                        <a href={href} style={{
                          fontFamily:     'Cabinet Grotesk, sans-serif',
                          fontSize:       '14px',
                          color: 'var(--muted)',
                          textDecoration: 'none',
                          transition:     'color .2s',
                        }}
                          onMouseEnter={e => e.target.style.color = 'var(--text)'}
                          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
                        >
                          {value}
                        </a>
                      ) : (
                        <span style={{
                          fontFamily: 'Cabinet Grotesk, sans-serif',
                          fontSize:   '14px',
                          color: 'var(--muted)',
                        }}>
                          {value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {CONTACT_CONFIG.socials.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily:     "'Courier New', monospace",
                      fontSize:       '10px',
                      letterSpacing:  '.14em',
                      textTransform:  'uppercase',
                      textDecoration: 'none',
                      padding:        '7px 16px',
                      borderRadius:   '6px',
                      color: 'var(--muted)',
                      border: '1px solid var(--border)',
                      background:     'transparent',
                      transition:     'all .22s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color       = 'var(--text)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,.3)'
                      e.currentTarget.style.background  = 'rgba(255,255,255,.06)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color       = 'rgba(255,255,255,.45)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'
                      e.currentTarget.style.background  = 'transparent'
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── RIGHT — Form ───────────────────────────────────── */}
            <div style={{
              opacity:    isVisible ? 1 : 0,
              transform:  isVisible ? 'none' : 'translateX(30px)',
              transition: 'opacity .8s ease .35s, transform .8s ease .35s',
            }}>
              <div style={{
                padding:      'clamp(24px, 4vw, 40px)',
                borderRadius: '20px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                position:     'relative',
                overflow:     'hidden',
              }}>
                {/* Corner glow */}
                <div aria-hidden style={{
                  position:     'absolute',
                  top: 0, right: 0,
                  width: '200px', height: '200px',
                  background:   'radial-gradient(circle at top right, rgba(108,99,255,.08), transparent 65%)',
                  pointerEvents: 'none',
                }} />
                <div aria-hidden style={{
                  position:     'absolute',
                  bottom: 0, left: 0,
                  width: '160px', height: '160px',
                  background:   'radial-gradient(circle at bottom left, rgba(0,217,181,.06), transparent 65%)',
                  pointerEvents: 'none',
                }} />

                {/* Form header */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{
                    fontFamily:    "'Courier New', monospace",
                    fontSize:      '10px',
                    letterSpacing: '.2em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom:  '8px',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '8px',
                  }}>
                    <span style={{
                      display:    'inline-block',
                      width:      '6px',
                      height:     '6px',
                      borderRadius: '50%',
                      background: '#3ddbb5',
                      boxShadow:  '0 0 6px #3ddbb5',
                      animation:  'blink 2.4s ease infinite',
                    }} />
                    New message
                  </div>
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize:   'clamp(20px, 2.5vw, 26px)',
                    fontWeight: 700,
                    color: 'var(--text)',
                    margin:     0,
                    letterSpacing: '-.3px',
                  }}>
                    Start a conversation
                  </h3>
                </div>

                {/* Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <GlowField
                    label="Your name"
                    name="name"
                    value={fields.name}
                    onChange={onChange}
                    error={errors.name}
                    theme={theme}
                  />
                  <GlowField
                    label="Email address"
                    name="email"
                    type="email"
                    value={fields.email}
                    onChange={onChange}
                    error={errors.email}
                    theme={theme}
                  />
                  <GlowField
                    label="What's on your mind?"
                    name="message"
                    multiline
                    value={fields.message}
                    onChange={onChange}
                    error={errors.message}
                    theme={theme}
                  />

                  <div style={{ marginTop: '6px' }}>
                    <SendButton state={fState} onClick={handleSend} />
                  </div>
                </div>

                {/* Sent confirmation */}
                {fState === 'sent' && (
                  <div style={{
                    marginTop:     '20px',
                    padding:       '14px 16px',
                    borderRadius:  '10px',
                    background:    'rgba(0,217,181,.07)',
                    border:        '1px solid rgba(0,217,181,.2)',
                    display:       'flex',
                    gap:           '10px',
                    alignItems:    'center',
                    animation:     'fadeUp .4s ease',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#00d9b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{
                      fontFamily:    "'Courier New', monospace",
                      fontSize:      '11px',
                      letterSpacing: '.1em',
                      color:         '#3ddbb5',
                    }}>
                      Message transmitted — I'll be in touch soon.
                    </span>
                  </div>
                )}

                {/* Noise texture overlay */}
                <div aria-hidden style={{
                  position:        'absolute',
                  inset:           0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                  backgroundSize:  '160px 160px',
                  borderRadius:    '20px',
                  pointerEvents:   'none',
                  mixBlendMode:    'overlay',
                  opacity:         .7,
                  zIndex:          5,
                }} />
              </div>

              {/* Footer note */}
              <p style={{
                fontFamily:    "'Courier New', monospace",
                fontSize:      '10px',
                color: 'var(--muted)',
                opacity: 0.6,
                letterSpacing: '.1em',
                marginTop:     '14px',
                paddingLeft:   '4px',
              }}>
                No spam ever · I read every message personally
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}