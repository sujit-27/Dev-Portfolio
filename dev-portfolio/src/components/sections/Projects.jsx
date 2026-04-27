import { useRef, useState, useEffect, useCallback } from 'react'
import { PROJECTS } from '../constants/data'

// ─────────────────────────────────────────────────────────────────────────────
// useScrollReveal — triggers when element enters viewport
// ─────────────────────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect() } },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ─────────────────────────────────────────────────────────────────────────────
// 3-D tilt hook — returns { style, onMove, onLeave }
// ─────────────────────────────────────────────────────────────────────────────
function useTilt(strength = 10) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, bx: '50%', by: '50%' })
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el   = ref.current
    if (!el) return
    const r    = el.getBoundingClientRect()
    const nx   = (e.clientX - r.left) / r.width  - 0.5   // -0.5 → 0.5
    const ny   = (e.clientY - r.top)  / r.height - 0.5
    setTilt({
      rx: -ny * strength,
      ry:  nx * strength,
      bx: `${(nx + 0.5) * 100}%`,
      by: `${(ny + 0.5) * 100}%`,
    })
  }, [strength])

  const onLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, bx: '50%', by: '50%' })
  }, [])

  const style = {
    transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02,1.02,1.02)`,
    '--bx': tilt.bx,
    '--by': tilt.by,
  }

  return { ref, style, onMove, onLeave }
}

// ─────────────────────────────────────────────────────────────────────────────
// Noise SVG  (base64 inline — no network request)
// ─────────────────────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`

// ─────────────────────────────────────────────────────────────────────────────
// Tag pill
// ─────────────────────────────────────────────────────────────────────────────
function Tag({ label }) {
  return (
    <span style={{
      fontFamily:    "'Courier New', monospace",
      fontSize:      '9px',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      padding:       '3px 8px',
      borderRadius:  '3px',
      color: 'var(--muted)',
      background: 'var(--tag-bg)',
      border: '1px solid var(--border)',
      whiteSpace:    'nowrap',
      display:       'inline-block',
    }}>
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjectCard
// ─────────────────────────────────────────────────────────────────────────────
function ProjectCard({ project, index, visible }) {
  const [hovered, setHovered]   = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const { ref, style: tiltStyle, onMove, onLeave } = useTilt(8)

  const delay = `${index * 110}ms`

  const handleLeave = () => {
    setHovered(false)
    onLeave()
  }

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{
        position:     'relative',
        borderRadius: '16px',
        overflow:     'hidden',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        cursor:       'pointer',
        transition:   `
          transform .35s cubic-bezier(.23,1,.32,1),
          box-shadow .35s ease,
          border-color .35s ease,
          opacity .6s ease ${delay},
          translate .6s ease ${delay}
        `,
        ...(hovered ? tiltStyle : {
          transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
        }),
        boxShadow: hovered
          ? '0 32px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.1)'
          : '0 8px 32px rgba(0,0,0,.3)',
        borderColor: hovered ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.07)',
        opacity:     visible ? 1 : 0,
        translate:   visible ? '0 0' : '0 40px',
        willChange:  'transform',
      }}
    >
      {/* ── Image area ───────────────────────────────────────────────── */}
      <div style={{
        position:   'relative',
        width:      '100%',
        paddingTop: '58%',
        overflow:   'hidden',
        background: 'var(--card-bg)',
      }}>
        {/* Project image */}
        <img
          src={project.image}
          alt={project.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            position:   'absolute',
            inset:      0,
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            transition: 'transform .6s cubic-bezier(.23,1,.32,1), filter .4s ease',
            transform:  hovered ? 'scale(1.06)' : 'scale(1)',
            filter:     imgLoaded
              ? (hovered ? 'brightness(.75) saturate(1.1)' : 'brightness(.6) saturate(.85)')
              : 'none',
            opacity:    imgLoaded ? 1 : 0,
          }}
        />

        {/* Skeleton shimmer while loading */}
        {!imgLoaded && (
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(90deg, #111116 0%, #1a1a22 50%, #111116 100%)',
            backgroundSize: '200% 100%',
            animation:  'shimmer 1.6s infinite',
          }} />
        )}

        {/* Noise overlay */}
        <div style={{
          position:       'absolute',
          inset:          0,
          backgroundImage: NOISE_SVG,
          backgroundSize: '200px 200px',
          pointerEvents:  'none',
          opacity:        .6,
          mixBlendMode:   'overlay',
        }} />

        {/* Scanline reveal on hover */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0px, rgba(0,0,0,.18) 1px, transparent 1px, transparent 4px)',
          opacity:    hovered ? 1 : 0,
          transition: 'opacity .35s ease',
          pointerEvents: 'none',
        }} />

        {/* Gradient fade to card body */}
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     '60%',
          background: 'linear-gradient(to bottom, transparent, var(--card-bg))',
          pointerEvents: 'none',
        }} />

        {/* Issue number stamp */}
        <div style={{
          position:      'absolute',
          top:           '14px',
          left:          '14px',
          fontFamily:    "'Courier New', monospace",
          fontSize:      '10px',
          letterSpacing: '.2em',
          color:         'rgba(255,255,255,.35)',
          background:    'rgba(10,10,15,.7)',
          padding:       '4px 10px',
          borderRadius:  '4px',
          border:        '1px solid rgba(255,255,255,.08)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}>
          {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </div>

        {/* Live / WIP badge */}
        {project.badge && (
          <div style={{
            position:      'absolute',
            top:           '14px',
            right:         '14px',
            fontFamily:    "'Courier New', monospace",
            fontSize:      '9px',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color:         project.badge === 'Live'    ? '#3ddbb5'
                         : project.badge === 'WIP'     ? '#ffbf4a'
                         : 'rgba(255,255,255,.4)',
            background:    project.badge === 'Live'    ? 'rgba(50,220,180,.1)'
                         : project.badge === 'WIP'     ? 'rgba(255,180,60,.1)'
                         : 'rgba(255,255,255,.05)',
            border:        `1px solid ${
                           project.badge === 'Live'    ? 'rgba(50,220,180,.3)'
                         : project.badge === 'WIP'     ? 'rgba(255,180,60,.3)'
                         : 'rgba(255,255,255,.1)'}`,
            padding:       '4px 10px',
            borderRadius:  '4px',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display:       'flex',
            alignItems:    'center',
            gap:           '5px',
          }}>
            {project.badge === 'Live' && (
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: '#3ddbb5',
                display: 'inline-block',
                boxShadow: '0 0 6px #3ddbb5',
                animation: 'pulse-dot 2s infinite',
              }} />
            )}
            {project.badge}
          </div>
        )}

        {/* Shimmer light that follows cursor (spotlight) */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: `radial-gradient(ellipse 180px 120px at var(--bx, 50%) var(--by, 50%), rgba(255,255,255,.07), transparent 70%)`,
          opacity:    hovered ? 1 : 0,
          transition: 'opacity .3s ease',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Card body ────────────────────────────────────────────────── */}
      <div style={{ padding: '22px 22px 24px' }}>

        {/* Tags row */}
        <div style={{
          display:    'flex',
          flexWrap:   'wrap',
          gap:        '6px',
          marginBottom: '14px',
        }}>
          {(project.tags || []).map(t => <Tag key={t} label={t} />)}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily:    'Syne, sans-serif',
          fontSize:      'clamp(17px, 2.2vw, 22px)',
          fontWeight:    800,
          letterSpacing: '-.4px',
          lineHeight:    1.15,
          color: 'var(--text)',
          margin:        '0 0 10px',
          transition:    'color .2s',
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'Cabinet Grotesk, sans-serif',
          fontSize:   '13.5px',
          lineHeight: 1.72,
          color: 'var(--muted)',
          margin:     '0 0 20px',
        }}>
          {project.description}
        </p>

        {/* Divider */}
        <div style={{
          height:     '1px',
          background: 'rgba(255,255,255,.06)',
          margin:     '0 0 18px',
        }} />

        {/* Links row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '6px',
                fontFamily:     "'Courier New', monospace",
                fontSize:       '10px',
                letterSpacing:  '.15em',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color:          hovered ? '#ffffff' : 'rgba(255,255,255,.5)',
                border:         `1px solid ${hovered ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.1)'}`,
                padding:        '7px 16px',
                borderRadius:   '6px',
                background:     hovered ? 'rgba(255,255,255,.06)' : 'transparent',
                transition:     'all .25s ease',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '6px',
                fontFamily:     "'Courier New', monospace",
                fontSize:       '10px',
                letterSpacing:  '.15em',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color: 'var(--muted)',
                transition:     'color .2s',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              Code
            </a>
          )}

          {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: 'var(--muted)',
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,.35)";
            }}
          >
            {/* External Link Icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/>
              <path d="M5 5h6V3H3v8h2V5z"/>
              <path d="M5 19h14V9h2v12H3V9h2v10z"/>
            </svg>

            Live
          </a>
        )}
        </div>
      </div>

      {/* Bottom accent line that draws on hover */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        height:     '2px',
        width:      hovered ? '100%' : '0%',
        background: 'linear-gradient(90deg, rgba(255,255,255,.0), rgba(255,255,255,.25), rgba(255,255,255,.0))',
        transition: 'width .5s cubic-bezier(.23,1,.32,1)',
      }} />
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjectsSection
// ─────────────────────────────────────────────────────────────────────────────
export default function Projects() {
  const [sectionRef, isVisible] = useScrollReveal(0.06)
  const [filter, setFilter]     = useState('All')

  // Collect unique tags for filter bar
  const allTags = ['All', ...Array.from(
    new Set(PROJECTS.flatMap(p => p.tags || []))
  )]

  const shown = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => (p.tags || []).includes(filter))

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1)   }
          50%       { opacity: .5; transform: scale(1.4) }
        }
        @keyframes line-in {
          from { width: 0 }
          to   { width: 24px }
        }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        aria-label="Projects"
        style={{
          padding: 'clamp(50px, 8vw, 90px) clamp(20px, 5vw, 48px) clamp(50px, 8vw, 80px)',
          background: 'var(--surface)',
          position:   'relative',
          overflow:   'hidden',
        }}
      >
        {/* Atmospheric blobs */}
        <div aria-hidden="true" style={{
          position:   'absolute', top: '-40px', left: '-40px',
          width:      '400px',    height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(50,220,180,.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position:   'absolute', bottom: '-30px', right: '-40px',
          width:      '460px',    height: '460px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(140,120,255,.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1380px', margin: '0 auto', position: 'relative' }}>

          {/* ── Section label ─────────────────────────────────────────── */}
          <div style={{
            fontFamily:    "'Courier New', monospace",
            fontSize:      '12px',
            letterSpacing: '.25em',
            textTransform: 'uppercase',
            color:         'var(--muted)',
            marginBottom:  '24px',
            display:       'flex',
            alignItems:    'center',
            gap:           '12px',
            opacity:       isVisible ? 1 : 0,
            transform:     isVisible ? 'none' : 'translateY(16px)',
            transition:    'opacity .6s ease, transform .6s ease',
          }}>
            <span style={{
              display:    'inline-block',
              width:      isVisible ? '24px' : '0px',
              height:     '1px',
              background: 'var(--primary)',
              transition: 'width .6s ease .2s',
            }} />
            03 / Projects
          </div>

          {/* ── Heading row ───────────────────────────────────────────── */}
          <div style={{
            display:        'flex',
            flexWrap:       'wrap',
            justifyContent: 'space-between',
            alignItems:     'flex-end',
            gap:            '24px',
            marginBottom:   '48px',
          }}>
            <div>
              <h2 style={{
                fontFamily:    'Syne, sans-serif',
                fontSize:      'clamp(28px, 4vw, 52px)',
                fontWeight:    800,
                letterSpacing: '-1.5px',
                lineHeight:    1.05,
                color:         'var(--text)',
                margin:        0,
                opacity:       isVisible ? 1 : 0,
                transform:     isVisible ? 'none' : 'translateY(20px)',
                transition:    'opacity .7s ease 80ms, transform .7s ease 80ms',
              }}>
                Selected work
              </h2>
              <p style={{
                fontFamily: 'Cabinet Grotesk, sans-serif',
                fontSize:   '15px',
                lineHeight: 1.7,
                color:      'var(--muted)',
                margin:     '12px 0 0',
                maxWidth:   '380px',
                opacity:    isVisible ? 1 : 0,
                transition: 'opacity .6s ease 160ms',
              }}>
                Things I've shipped — hover a card to feel it breathe.
              </p>
            </div>

            {/* Project count pill */}
            <div style={{
              fontFamily:    "'Courier New', monospace",
              fontSize:      '11px',
              letterSpacing: '.15em',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              padding:       '8px 18px',
              borderRadius:  '100px',
              background:    'rgba(255,255,255,.03)',
              opacity:       isVisible ? 1 : 0,
              transition:    'opacity .6s ease 240ms',
            }}>
              7+ projects
            </div>
          </div>

          {/* ── Filter bar ────────────────────────────────────────────── */}
          {allTags.length > 1 && (
            <div style={{
              display:       'flex',
              flexWrap:      'wrap',
              gap:           '8px',
              marginBottom:  '36px',
              opacity:       isVisible ? 1 : 0,
              transition:    'opacity .6s ease 300ms',
            }}>
              {allTags.map(tag => {
                const active = filter === tag
                return (
                  <button
                    key={tag}
                    onClick={() => setFilter(tag)}
                    style={{
                      fontFamily:    "'Courier New', monospace",
                      fontSize:      '10px',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      padding:       '5px 14px',
                      borderRadius:  '20px',
                      color: active ? 'var(--text)' : 'var(--muted)',
                      border: `1px solid var(--border)`,
                      background: active ? 'var(--tag-bg)' : 'transparent',
                      cursor:        'pointer',
                      outline:       'none',
                      transition:    'all .22s ease',
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Grid ──────────────────────────────────────────────────── */}
          <div style={{
            display:               'grid',
            gridTemplateColumns:   'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
            gap:                   '20px',
          }}>
            {shown.map((project, i) => (
              <ProjectCard
                key={project.id ?? project.title}
                project={project}
                index={i}
                visible={isVisible}
              />
            ))}
          </div>

          {/* ── Footer note ───────────────────────────────────────────── */}
          <div style={{
            marginTop:     '56px',
            paddingTop:    '28px',
            borderTop: '1px solid var(--border)',
            display:       'flex',
            justifyContent: 'space-between',
            alignItems:    'center',
            flexWrap:      'wrap',
            gap:           '16px',
            opacity:       isVisible ? 1 : 0,
            transition:    'opacity .6s ease 500ms',
          }}>
            <a
            href="https://github.com/sujit-27"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '10px',
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#00D9B5";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            More on GitHub →
          </a>
            <div style={{ display: 'flex', gap: '4px' }}>
              {PROJECTS.map((_, i) => (
                <div key={i} style={{
                  width:        i < shown.length ? '18px' : '6px',
                  height:       '2px',
                  borderRadius: '2px',
                  background:   'var(--primary)',
                  transition:   'width .3s ease',
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}