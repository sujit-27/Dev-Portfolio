import { useState, useEffect, useContext } from 'react'
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { ThemeContext } from '../../hooks/ThemeProvider'

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  year:  new Date().getFullYear(),
  email: 'sujitshaw029@gmail.com',
  navLinks: [
    { label: 'Home',     href: '#hero'     },
    { label: 'About',    href: '#about'    },
    { label: 'Skills',   href: '#skills'   },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact',  href: '#contact'  },
  ],
  socials: [
    { label: <FaGithub />,  full: 'GitHub',   href: 'https://github.com/yourname'      },
    { label: <FaInstagram />,  full: 'Instagram',  href: 'https://instagram.com/yourname'    },
    { label: <FaLinkedin />,  full: 'LinkedIn', href: 'https://linkedin.com/in/yourname' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Smooth scroll to top
// ─────────────────────────────────────────────────────────────────────────────
function scrollTop() {
  const start = window.scrollY
  const t0    = performance.now()
  const ease  = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2
  const step  = now => {
    const p = Math.min((now - t0) / 800, 1)
    window.scrollTo(0, start * (1 - ease(p)))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// ─────────────────────────────────────────────────────────────────────────────
// Back-to-top pill (fixed)
// ─────────────────────────────────────────────────────────────────────────────
function BackToTop() {
  const [show,  setShow]  = useState(false)
  const [hov,   setHov]   = useState(false)
  const [fired, setFired] = useState(false)
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark'

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 300)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const click = () => {
    setFired(true)
    setTimeout(() => {
      scrollTop()
      setTimeout(() => setFired(false), 900)
    }, 240)
  }

  return (
    <button
      aria-label="Back to top"
      onClick={click}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:       'fixed',
        bottom:         '12px',
        right:          '24px',
        zIndex:         200,
        display:        'flex',
        alignItems:     'center',
        gap:            '6px',
        padding:        '8px 14px',
        borderRadius:   '100px',
        background: hov
        ? 'rgba(108,99,255,.18)'
        : isDark
        ? 'rgba(6,6,8,.88)'
        : '#ffffff',

      color: hov
        ? '#6c63ff'
        : isDark
        ? 'rgba(255,255,255,.35)'
        : 'rgba(0,0,0,.6)',

      border: `1px solid ${
        hov
          ? 'rgba(108,99,255,.5)'
          : isDark
          ? 'rgba(255,255,255,.1)'
          : 'rgba(0,0,0,.1)'
      }`,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        fontFamily:     "'Courier New', monospace",
        fontSize:       '9px',
        letterSpacing:  '.18em',
        textTransform:  'uppercase',
        cursor:         'pointer',
        outline:        'none',
        opacity:        show ? 1 : 0,
        pointerEvents:  show ? 'all' : 'none',
        transform:      fired
          ? 'translateY(-56px) scale(.65)'
          : show ? 'translateY(0) scale(1)' : 'translateY(10px) scale(.9)',
        transition:     'opacity .35s, transform .4s cubic-bezier(.23,1,.32,1), background .2s, border-color .2s, color .2s',
        boxShadow:      hov ? '0 4px 20px rgba(108,99,255,.28)' : 'none',
        whiteSpace:     'nowrap',
      }}
    >
      <svg
        width="10" height="10" viewBox="0 0 12 12" fill="none"
        style={{ transform: fired ? 'translateY(-3px)' : 'none', transition: 'transform .28s' }}
      >
        <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Top
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const { year, email, navLinks, socials } = CONFIG
  const [hovEmail, setHovEmail] = useState(false)

  const isDark = theme === 'dark'

  return (
    <>
      <style>{`
        @keyframes sweep1 {
          0%   { left:-30%; opacity:0  }
          10%  { opacity:1  }
          90%  { opacity:1  }
          100% { left:110%; opacity:0  }
        }
        @keyframes sweep2 {
          0%   { left:-40%; opacity:0  }
          15%  { opacity:.7 }
          85%  { opacity:.7 }
          100% { left:110%; opacity:0  }
        }
        @keyframes dotPulse {
          0%,100% { transform:scale(1);   opacity:1   }
          50%      { transform:scale(1.6); opacity:.35 }
        }
        .ft-a {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: .2em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--muted);
          transition: color .2s;
        }
        .ft-a:hover { color: rgba(255,255,255,.7) !important }
        .ft-soc {
          font-family: 'Courier New', monospace;
          font-size: 9px;
          letter-spacing: .13em;
          text-decoration: none;
          color: var(--muted);
          border: 1px solid var(--border);
          background: var(--tag-bg);
          padding: 4px 9px;
          border-radius: 5px;
          transition: color .2s, border-color .2s, background .2s;
        }
        .ft-soc:hover {
          color: #fff !important;
          border-color: rgba(255,255,255,.22) !important;
          background: rgba(255,255,255,.05) !important;
        }

        /* ── Responsive stacking ── */
        @media (max-width: 700px) {
          .ft-nav  { display: none !important }
          .ft-row  { flex-direction: column !important; gap: 12px !important; padding: 14px 16px !important }
          .ft-right { flex-wrap: wrap !important; justify-content: center !important }
          .ft-left  { justify-content: center !important }
        }
      `}</style>

      <footer style={{
        background: isDark ? '#060608' : '#ffffff',
        position:   'relative',
        overflow:   'hidden',
      }}>

        {/* ── Shimmer top border ─────────────────────────────── */}
        <div style={{ position:'relative', height:'1px', overflow:'visible' }}>
          <div style={{ position:'absolute', inset:0, background: isDark
          ? 'rgba(255,255,255,.05)'
          : 'rgba(0,0,0,.08)', }} />
          <div style={{
            position:'absolute', top:'-1px', left:'-30%',
            width:'32%', height:'2px', borderRadius:'2px',
            background:'linear-gradient(90deg,transparent,rgba(108,99,255,.85),rgba(0,217,181,.55),transparent)',
            animation:'sweep1 4s ease-in-out infinite',
            filter:'blur(.4px)',
          }} />
          <div style={{
            position:'absolute', top:'-1px', left:'-40%',
            width:'20%', height:'2px', borderRadius:'2px',
            background:'linear-gradient(90deg,transparent,rgba(255,181,71,.55),transparent)',
            animation:'sweep2 6.5s ease-in-out infinite 1.8s',
            filter:'blur(.4px)',
          }} />
        </div>

        {/* ── Radial glow atmosphere ────────────────────────── */}
        <div aria-hidden style={{
          position:'absolute', top:'-100px', left:'50%',
          transform:'translateX(-50%)',
          width:'600px', height:'260px', borderRadius:'50%',
          background:'radial-gradient(ellipse,rgba(108,99,255,.04) 0%,transparent 65%)',
          pointerEvents:'none',
        }} />

        {/* ── Single content row ────────────────────────────── */}
        <div className="ft-row" style={{
          maxWidth:       '1200px',
          margin:         '0 auto',
          padding:        '16px clamp(16px,4vw,48px)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '12px',
          position:       'relative',
          zIndex:         2,
        }}>

          {/* LEFT — year + dot */}
          <div className="ft-left" style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
            <span style={{
              width:'5px', height:'5px', borderRadius:'50%',
              background:'#3ddbb5', boxShadow:'0 0 6px #3ddbb5',
              display:'inline-block',
              animation:'dotPulse 2.6s ease infinite',
            }} />
            <span style={{
              fontFamily:    "'Courier New', monospace",
              fontSize:      '10px',
              letterSpacing: '.18em',
              color: isDark
              ? 'rgba(255,255,255,.22)'
              : 'rgba(0,0,0,.6)',
            }}>
              © {year}
            </span>
          </div>

          {/* CENTER — nav (hidden on mobile) */}
          <nav className="ft-nav" aria-label="Footer navigation" style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '2px',
          }}>
            {navLinks.map(({ label, href }, i) => (
              <span key={label} style={{ display:'inline-flex', alignItems:'center' }}>
                <a href={href} className="ft-a" style={{ padding:'4px 10px' }}>{label}</a>
                {i < navLinks.length - 1 && (
                  <span style={{ color:'rgba(108,99,255,.3)', fontSize:'6px' }}>◆</span>
                )}
              </span>
            ))}
          </nav>

          {/* RIGHT — socials + divider + email */}
          <div className="ft-right" style={{ display:'flex', alignItems:'center', gap:'7px', flexShrink:0 }}>
            {socials.map(({ label, full, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                title={full} className="ft-soc">
                {label}
              </a>
            ))}

            <div style={{ width:'1px', height:'14px', background: isDark
            ? 'rgba(255,255,255,.08)'
            : 'rgba(0,0,0,.1)', margin:'0 3px' }} />

            {/* Email */}
            <a
              href={`mailto:${email}`}
              onMouseEnter={() => setHovEmail(true)}
              onMouseLeave={() => setHovEmail(false)}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '5px',
                fontFamily:     "'Courier New', monospace",
                fontSize:       '9px',
                letterSpacing:  '.13em',
                textDecoration: 'none',
                color: hovEmail
                ? '#6c63ff'
                : isDark
                ? 'rgba(255,255,255,.28)'
                : 'rgba(0,0,0,.6)',
                transition:     'color .2s',
                position:       'relative',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 5l8 7 8-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {email}
              <span style={{
                position:   'absolute',
                bottom:     '-2px',
                left:       0,
                width:      hovEmail ? '100%' : '0%',
                height:     '1px',
                background: 'linear-gradient(90deg,#6c63ff,#00d9b5)',
                transition: 'width .3s cubic-bezier(.23,1,.32,1)',
              }} />
            </a>
          </div>
        </div>

        {/* ── Noise grain ───────────────────────────────────── */}
        <div aria-hidden style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize:  '160px 160px',
          mixBlendMode:    'overlay',
          opacity:         .5,
          pointerEvents:   'none',
          zIndex:          1,
        }} />
      </footer>

      <BackToTop />
    </>
  )
}