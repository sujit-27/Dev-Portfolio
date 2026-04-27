import { useEffect } from 'react'

const CSS = `
  /* ── Custom properties ────────────────────────────── */
  :root {
    --primary:   #6C63FF;
    --secondary: #00D9B5;
    --bg:        #0A0A0F;
    --surface:   #111118;
    --surf-r:    #1A1A25;
    --border:    #2A2A3F;
    --text:      #F0EEFF;
    --muted:     #7A7A9A;
    --danger:    #FF5E6C;
    --success:   #3DDC84;
    --navbar-h:  72px;
  }

  .light {
    --bg:      #F5F4FF;
    --surface: #FFFFFF;
    --surf-r:  #EEEEFF;
    --border:  #D0D0E8;
    --text:    #0A0A0F;
    --muted:   #5A5A7A;
  }

  /* ── Base ─────────────────────────────────────────── */
  html { scroll-behavior: smooth; }

  body {
    background-color: var(--bg);
    color: var(--text);
    font-family: 'Cabinet Grotesk', sans-serif;
    cursor: none;
    overflow-x: hidden;
  }

  * { box-sizing: border-box; }

  /* ── Scrollbar ────────────────────────────────────── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 2px; }

  /* ── Selection ────────────────────────────────────── */
  ::selection { background: #6C63FF44; color: var(--text); }

  /* ── Focus ring ───────────────────────────────────── */
  :focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }

  /* ── Keyframes ────────────────────────────────────── */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1);   }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 0px var(--primary); }
    50%     { box-shadow: 0 0 24px var(--primary), 0 0 48px #6C63FF44; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px);   }
    50%     { transform: translateY(-12px); }
  }
  @keyframes bounceY {
    0%,100% { transform: translateY(0);   }
    50%     { transform: translateY(8px); }
  }
  @keyframes blink {
    0%,100% { opacity: 1; }
    50%     { opacity: 0; }
  }
  @keyframes glitch {
    0%        { clip-path: inset(0 0 95% 0); transform: translate(-4px, 0); }
    10%       { clip-path: inset(40% 0 40% 0); transform: translate(4px, 0); }
    20%       { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
    30%,100%  { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-10px) rotate(0deg);   opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes dotBounce {
    0%,80%,100% { transform: translateY(0);   }
    40%         { transform: translateY(-8px); }
  }
  @keyframes xDraw {
    to { stroke-dashoffset: 0; }
  }
  @keyframes oDraw {
    to { stroke-dashoffset: 0; }
  }
  @keyframes radialFan {
    from { opacity: 0; transform: scale(0.5) translateY(10px); }
    to   { opacity: 1; transform: scale(1)   translateY(0);    }
  }
  @keyframes progressBar {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes rainDrop {
    0%   { transform: translateY(-10px); opacity: 0; }
    10%  { opacity: 1; }
    100% { transform: translateY(20px);  opacity: 0; }
  }
  @keyframes sunSpin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  @keyframes cloudFloat {
    0%,100% { transform: translateX(0px);  }
    50%     { transform: translateX(6px); }
  }

  /* ── Utility classes ──────────────────────────────── */
  .animate-fadeInUp   { animation: fadeInUp   0.7s ease forwards; }
  .animate-slideLeft  { animation: slideInLeft 0.7s ease forwards; }
  .animate-scaleIn    { animation: scaleIn    0.5s ease forwards; }
  .animate-float      { animation: float      6s ease-in-out infinite; }
  .animate-pulseGlow  { animation: pulseGlow  2s ease-in-out infinite; }
  .animate-bounceY    { animation: bounceY    1.5s ease-in-out infinite; }
  .animate-blink      { animation: blink      1s step-end infinite; }
  .animate-dotBounce  { animation: dotBounce  1.4s ease-in-out infinite; }

  .delay-100  { animation-delay: 100ms; }
  .delay-200  { animation-delay: 200ms; }
  .delay-300  { animation-delay: 300ms; }
  .delay-400  { animation-delay: 400ms; }
  .delay-500  { animation-delay: 500ms; }
  .delay-600  { animation-delay: 600ms; }
  .delay-700  { animation-delay: 700ms; }

  /* ── Glass surface ────────────────────────────────── */
  .glass {
    background: rgba(17, 17, 24, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border);
  }
  .light .glass {
    background: rgba(255, 255, 255, 0.75);
  }

  /* ── Gradient text ────────────────────────────────── */
  .gradient-text {
    background: linear-gradient(135deg, #6C63FF 0%, #00D9B5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Shimmer bar ──────────────────────────────────── */
  .shimmer-bar {
    background: linear-gradient(
      90deg,
      var(--primary) 0%,
      var(--secondary) 40%,
      var(--primary) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2.5s linear infinite;
  }

  /* ── Noise overlay (hero film grain) ─────────────── */
  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  /* ── Reduced motion ───────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`

export default function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement('style')
    el.setAttribute('data-portfolio', 'global')
    el.textContent = CSS
    document.head.appendChild(el)
    return () => el.remove()
  }, [])
  return null
}