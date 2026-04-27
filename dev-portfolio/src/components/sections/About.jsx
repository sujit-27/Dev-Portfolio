import { useState } from 'react'
import { IDENTITY, TECH_STACK } from '../constants/data'
import useScrollAnim from '../../hooks/useScrollAnim'

// ── Education data — move to data.js if preferred ────────────────────────────
const EDUCATION = [
  {
    degree:      'B.Tech in Information Technology',
    institution: 'Kalyani Government Engineering College',
    period:      '2023 – 2027',
    grade:       'CGPA 8.3 / 10',
    highlights:  ['Data Structures & Algorithms', 'System Design', 'Operating Systems'],
    icon:        '🎓',
    accent:      '#6C63FF',
  },
  {
    degree:      'Higher Secondary (Science)',
    institution: "Maria's Day School",
    period:      '2021 – 2023',
    grade:       '90%',
    highlights:  ['Physics', 'Mathematics', 'Computer Science'],
    icon:        '📚',
    accent:      '#00D9B5',
  },
  {
    degree:      'Secondary Education',
    institution: 'Maria’s Day School',
    period:      '2019 – 2021',
    grade:       '92%',
    highlights:  ['Science Stream', 'Mathematics', 'School Topper'],
    icon:        '🏫',
    accent:      '#FF5E6C',
  },
]

// ── Currently Building Badge ──────────────────────────────────────────────────
function BuildingBadge({ isVisible }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '10px',
      background: 'var(--surf-r)',
      border: '1px solid var(--border)',
      borderRadius: '100px', padding: '7px 16px 7px 10px',
      marginBottom: '28px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.6s ease 50ms, transform 0.6s ease 50ms',
    }}>
      <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{
          position: 'absolute',
          width: '10px', height: '10px', borderRadius: '50%',
          background: 'var(--success)', opacity: 0.4,
          animation: 'ping 1.5s ease-out infinite',
        }}/>
        <span style={{
          width: '10px', height: '10px', borderRadius: '50%',
          background: 'var(--success)', display: 'block', position: 'relative',
        }}/>
      </span>
      <span style={{
        fontFamily: 'DM Mono, monospace', fontSize: '12px',
        color: 'var(--muted)', letterSpacing: '0.06em',
      }}>
        Currently building{' '}
        <span style={{ color: 'var(--secondary)', fontWeight: 500 }}>
          something cool
        </span>
      </span>
    </div>
  )
}

// ── Tech Badge with tooltip ───────────────────────────────────────────────────
function TechBadge({ name, color, index, isVisible }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={name}
        style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: hovered ? `${color}18` : 'var(--surf-r)',
          border: `1px solid ${hovered ? color + '66' : 'var(--border)'}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.22s ease',
          transform: hovered ? 'translateY(-4px) scale(1.08)' : 'translateY(0) scale(1)',
          boxShadow: hovered ? `0 8px 20px ${color}30` : 'none',
          opacity: isVisible ? 1 : 0,
          transitionDelay: isVisible ? `${400 + index * 55}ms` : '0ms',
        }}
      >
        <span style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '12px',
          color: hovered ? color : 'var(--muted)',
          transition: 'color 0.2s',
        }}>
          {name.slice(0, 2).toUpperCase()}
        </span>
      </button>

      {/* Tooltip */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
        transform: `translateX(-50%) translateY(${hovered ? 0 : 4}px)`,
        background: 'var(--surface)',
        border: `1px solid ${color}44`,
        borderRadius: '8px', padding: '4px 10px',
        fontFamily: 'DM Mono, monospace', fontSize: '11px',
        color, whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        zIndex: 10,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }}>
        {name}
      </div>
    </div>
  )
}

// ── Education Timeline Card ───────────────────────────────────────────────────
function TimelineCard({ item, index, isVisible, isLast }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '18px', position: 'relative' }}>

      {/* Spine column */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', flexShrink: 0, width: '32px',
      }}>
        {/* Node */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: `${item.accent}15`,
          border: `2px solid ${item.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', flexShrink: 0,
          boxShadow: `0 0 14px ${item.accent}33`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.4)',
          transition: `opacity 0.45s ease ${120 + index * 170}ms,
                       transform 0.45s ease ${120 + index * 170}ms`,
        }}>
          {item.icon}
        </div>

        {/* Vertical line */}
        {!isLast && (
          <div style={{
            width: '2px', flex: 1, marginTop: '6px', minHeight: '28px',
            background: `linear-gradient(to bottom, ${item.accent}55, transparent)`,
          }}/>
        )}
      </div>

      {/* Card */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={e => e.key === 'Enter' && setExpanded(ex => !ex)}
        style={{
          flex: 1,
          marginBottom: isLast ? 0 : '20px',
          background: 'var(--surf-r)',
          border: `1px solid ${expanded ? item.accent + '44' : 'var(--border)'}`,
          borderRadius: '16px', padding: '18px 20px',
          cursor: 'pointer',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease, transform 0.5s ease',
          boxShadow: expanded ? `0 6px 28px ${item.accent}18` : 'none',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
          transitionDelay: `${170 + index * 170}ms`,
        }}
      >
        {/* Top row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: '10px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontSize: '14px',
              fontWeight: 700, color: 'var(--text)',
              lineHeight: 1.35, marginBottom: '5px',
            }}>
              {item.degree}
            </div>
            <div style={{
              fontFamily: 'Cabinet Grotesk, sans-serif', fontSize: '13px',
              color: 'var(--muted)', marginBottom: '10px',
            }}>
              {item.institution}
            </div>
            <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '11px',
                color: item.accent, background: `${item.accent}14`,
                padding: '2px 9px', borderRadius: '100px', letterSpacing: '0.04em',
              }}>
                {item.period}
              </span>
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: '11px',
                color: 'var(--muted)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '2px 9px', borderRadius: '100px',
              }}>
                {item.grade}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <div style={{
            color: 'var(--muted)', flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            paddingTop: '2px',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {/* Expandable highlights */}
        <div style={{
          overflow: 'hidden',
          maxHeight: expanded ? '160px' : '0',
          transition: 'max-height 0.35s ease',
        }}>
          <div style={{
            paddingTop: '14px',
            display: 'flex', flexWrap: 'wrap', gap: '6px',
          }}>
            {item.highlights.map(h => (
              <span key={h} style={{
                fontFamily: 'Cabinet Grotesk, sans-serif', fontSize: '12px',
                color: 'var(--text)', fontWeight: 500,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '4px 10px', borderRadius: '100px',
              }}>
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AboutSection() {
  const [sectionRef, isVisible] = useScrollAnim(0.08)

  const bioLines = IDENTITY.bio
    .split(/\n|(?<=\.)\s+/)
    .map(s => s.trim())
    .filter(Boolean)

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About me"
      style={{
        padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 48px)',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Section label */}
      <div style={{
        fontFamily: 'DM Mono, monospace', fontSize: '12px',
        letterSpacing: '0.25em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: '64px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span style={{
          display: 'inline-block', width: '24px', height: '1px',
          background: 'var(--primary)',
        }}/>
        01 / About
      </div>

      {/* Two-column grid — stacks on mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 'clamp(48px, 8vw, 88px)',
        alignItems: 'start',
      }}>

        {/* ══ LEFT: Bio + Tech Stack ═══════════════════ */}
        <div>
          <BuildingBadge isVisible={isVisible} />

          {/* Heading */}
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 800, letterSpacing: '-1px',
            lineHeight: 1.1, margin: '0 0 28px',
            color: 'var(--text)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease 100ms, transform 0.7s ease 100ms',
          }}>
            Crafting digital
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #6C63FF, #00D9B5)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              experiences.
            </span>
          </h2>

          {/* Bio paragraphs — staggered fade */}
          <div style={{ marginBottom: '32px' }}>
            {bioLines.map((line, i) => (
              <p key={i} style={{
                fontFamily: 'Cabinet Grotesk, sans-serif',
                fontSize: '15.5px', lineHeight: 1.85,
                color: 'var(--muted)', margin: '0 0 12px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity 0.6s ease ${180 + i * 100}ms,
                             transform 0.6s ease ${180 + i * 100}ms`,
              }}>
                {line}
              </p>
            ))}
          </div>

          {/* Quick fact pills */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '9px',
            marginBottom: '40px',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 380ms',
          }}>
            {[
              { label: 'Location', value: IDENTITY.location.city },
              { label: 'Status',   value: 'Open to work'         },
              { label: 'Focus',    value: 'Full Stack'            },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: '7px 14px', borderRadius: '100px',
                background: 'var(--surf-r)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: '7px',
              }}>
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '11px',
                  color: 'var(--muted)', letterSpacing: '0.06em',
                }}>
                  {label}:
                </span>
                <span style={{
                  fontFamily: 'Cabinet Grotesk, sans-serif',
                  fontSize: '13px', fontWeight: 600, color: 'var(--text)',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Tech stack label */}
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: '14px',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 460ms',
          }}>
            Tech Stack
          </div>

          {/* Tech icons row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TECH_STACK.map((tech, i) => (
              <TechBadge
                key={tech.name}
                {...tech}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* ══ RIGHT: Education Timeline ════════════════ */}
        <div>
          {/* Timeline heading */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            marginBottom: '36px',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 60ms, transform 0.6s ease 60ms',
          }}>
            <h3 style={{
              fontFamily: 'Syne, sans-serif', fontSize: '22px',
              fontWeight: 700, color: 'var(--text)', margin: 0, whiteSpace: 'nowrap',
            }}>
              Education
            </h3>
            <div style={{
              flex: 1, height: '1px',
              background: 'linear-gradient(to right, var(--border), transparent)',
            }}/>
          </div>

          {/* Cards */}
          {EDUCATION.map((item, i) => (
            <TimelineCard
              key={item.degree}
              item={item}
              index={i}
              isVisible={isVisible}
              isLast={i === EDUCATION.length - 1}
            />
          ))}

          {/* Learning note */}
          <div style={{
            marginTop: '28px', padding: '15px 18px',
            borderRadius: '14px',
            background: 'var(--surf-r)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: '12px',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 680ms',
          }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>🌱</span>
            <p style={{
              fontFamily: 'Cabinet Grotesk, sans-serif',
              fontSize: '13px', lineHeight: 1.65,
              color: 'var(--muted)', margin: 0,
            }}>
              Always learning — currently exploring{' '}
              <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                system design
              </span>{' '}
              and{' '}
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                distributed systems
              </span>.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0;   }
        }
      `}</style>
    </section>
  )
}