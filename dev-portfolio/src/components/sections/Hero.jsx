import { useContext, useRef } from "react";
import { IDENTITY, ROLES } from "../constants/data";
import useTypewriter from "../../hooks/useTypewriter";
import useParticleCanvas from "../../hooks/useParticleCanvas";
import me from "../../assets/Me.jpeg";
import { ThemeContext } from "../../hooks/ThemeProvider";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function HeroSection() {
  const canvasRef = useRef(null);
  useParticleCanvas(canvasRef);

  const { theme } = useContext(ThemeContext);
  const isMobile = window.innerWidth < 900;
  const { display } = useTypewriter(ROLES, 80, 40, 1800);

  const handleMouseMove = (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  const el = document.querySelector(".floating-wrapper");
    if (el) {
        el.style.transform = `translate(${x}px, ${y}px)`;
    }
    };

  const socialStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    color: "var(--text)",
    border: "1px solid var(--border)",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    transition: "0.3s",
  };

  const iconStyle = {
    color: "var(--muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
};

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        minHeight: "100vh",
        paddingTop: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
        }}
        />

        {!isMobile && (
        <div
            style={{
            position: "fixed",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            zIndex: 10,
            }}
        >
            {[
            {
                icon: <FaGithub />,
                link: "https://github.com/sujit-27",
                delay: "0s",
            },
            {
                icon: <FaLinkedinIn />,
                link: "https://linkedin.com/in/sujit-kumar-shaw",
                delay: "0.4s",
            },
            {
                icon: <FaInstagram />,
                link: "https://instagram.com/sujit.815",
                delay: "0.8s",
            },
            ].map((item, i) => (
            <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{
                ...socialStyle,
                animation: `floatY 4s ease-in-out infinite`,
                animationDelay: item.delay,
                }}
                onMouseEnter={(e) => {
                e.currentTarget.style.color = "#00D9B5";
                e.currentTarget.style.transform = "translateY(-4px) scale(1.1)";
                e.currentTarget.style.boxShadow =
                    "0 0 15px rgba(0,217,181,0.4)";
                }}
                onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
                }}
            >
                {item.icon}
            </a>
            ))}
        </div>
        )}

      {/* MAIN GRID */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1450px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "200px",
          padding: isMobile ? "20px" : "20px 50px",
          alignItems: "center",
        }}
      >
        {/* ================= LEFT ================= */}
        <div style={{ maxWidth: "600px", animation: "fadeUp 0.8s ease forwards" }}>
  
        {/* ROLE */}
        <p
            style={{
            color: "var(--secondary)",
            fontFamily: "DM Mono",
            letterSpacing: "0.3em",
            fontSize: "12px",
            marginBottom: "14px",
            }}
        >
            FULL STACK JAVA DEVELOPER
        </p>

        {/* NAME */}
        <h1
            style={{
            fontSize: "clamp(52px, 7vw, 72px)",
            fontWeight: "800",
            fontFamily: "Syne",
            lineHeight: "1.05",
            letterSpacing: "-1px",
            background:
                "linear-gradient(90deg, #6C63FF, #00D9B5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
            }}
        >
            Sujit Kumar Shaw
        </h1>

        {/* ROLE ANIMATION */}
        <h2
            style={{
            fontSize: "22px",
            marginBottom: "18px",
            color: "var(--text)",
            fontWeight: "500",
            }}
        >
            {display}
            <span style={{ color: "#6C63FF" }}>|</span>
        </h2>

        {/* BIO */}
        <p
            style={{
            color: "var(--muted)",
            maxWidth: "520px",
            marginBottom: "34px",
            fontSize: "16px",
            lineHeight: "1.7",
            }}
        >
            I build scalable, high-performance web applications with a focus on clean architecture and user-centric design. Passionate about solving real-world problems through efficient and modern technologies.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: "18px" }}>
        
        {/* VIEW WORK */}
        <button
            onClick={() => {
            document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }}
            style={{
            padding: "14px 28px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6C63FF, #00D9B5)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            boxShadow: "0 10px 30px rgba(108,99,255,0.4)",
            }}
        >
            View Work →
        </button>

        {/* DOWNLOAD CV */}
        <a
            href="/My_Resume.pdf" 
            download
            style={{
            textDecoration: "none",
            }}
        >
            <button
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "14px 28px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.02)",
                color: "var(--text)",
                cursor: "pointer",
                backdropFilter: "blur(10px)",
            }}
            >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
            </svg>
            Download CV
            </button>
        </a>

        </div>
        </div>
        {isMobile && (
        <div
            style={{
                marginTop: "40px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
            }}
            >
            {/* TEXT */}
            <span
                style={{
                fontSize: "12px",
                letterSpacing: "0.3em",
                color: "var(--muted)",
                }}
            >
                FIND ME ON
            </span>

            {/* LINE */}
            <div
                style={{
                width: "40px",
                height: "1px",
                background: "var(--border)",
                }}
            />

            {/* ICONS */}
            <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                
                {/* GitHub */}
                <a
                href="https://github.com/sujit-27"
                target="_blank"
                rel="noreferrer"
                style={iconStyle}
                >
                <FaGithub size={18} />
                </a>

                {/* LinkedIn */}
                <a
                href="https://linkedin.com/in/sujit-kumar-shaw"
                target="_blank"
                rel="noreferrer"
                style={iconStyle}
                >
                <FaLinkedinIn size={18} />
                </a>

                <a
                href="https://instagram.com/sujit.815"
                target="_blank"
                rel="noreferrer"
                style={iconStyle}
                >
                <FaInstagram size={18} />
                </a>

                {/* ACTIVE DOT (like your reference) */}
                <div
                style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "2px solid #00D9B5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                <div
                    style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#00D9B5",
                    }}
                />
                </div>
            </div>
            </div>
        )}

        <div
        style={{
            position: "relative",
            width: "420px",
            height: "420px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "fadeScale 1s ease forwards",
        }}
        >
        {/* 🔥 OUTER GLOW */}
        <div
            style={{
            position: "absolute",
            width: "520px",
            height: "420px",
            borderRadius: "50%",
            background:
            theme === "dark"
                ? "radial-gradient(circle, rgba(108,99,255,0.25), transparent)"
                : "radial-gradient(circle, rgba(108,99,255,0.15), transparent)",
            filter: "blur(40px)",
            }}
        />

        {/* 🔥 INNER GLASS CIRCLE */}
        <div
            style={{
            position: "absolute",
            width: window.innerWidth < 900 ? "260px" : "320px",
            height: window.innerWidth < 900 ? "260px" : "320px",
            borderRadius: "100%",
            backdropFilter: "blur(15px)",
            border:
            theme === "dark"
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.08)",
            boxShadow:
                "inset 0 0 40px rgba(255,255,255,0.05), 0 0 40px rgba(108,99,255,0.2)",
            }}
        />

        {/* 🔥 PROFILE IMAGE */}
        <img
            src={me}
            alt="profile"
            style={{
            width: "340px",
            height: "340px",
            borderRadius: "100%",
            objectFit: "cover",
            zIndex: 2,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
            filter: "brightness(0.95) contrast(1.05) saturate(1.05)",
            }}
        />

        {/* 🔥 FLOATING TECH TAGS (FIXED POSITIONS) */}
        <div className="tag tag1">React</div>
        <div className="tag tag2">SpringBoot</div>
        <div className="tag tag3">Java</div>
        <div className="tag tag4">PostgreSQL</div>
        </div>
      </div>
      <div
        onClick={() => {
            const el = document.getElementById("about");
            if (el) {
            window.scrollTo({
                top: el.offsetTop - 80,
                behavior: "smooth",
            });
            }
        }}
        style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            zIndex: 5,
        }}
        >
        {/* TEXT */}
        <span
            style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            color: "var(--muted)",
            }}
        >
            SCROLL
        </span>

        {/* MOUSE ICON */}
        <div
            style={{
            width: "22px",
            height: "36px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            display: "flex",
            justifyContent: "center",
            paddingTop: "6px",
            }}
        >
            <div
            style={{
                width: "3px",
                height: "6px",
                borderRadius: "2px",
                background: "#00D9B5",
                animation: "scrollDot 1.5s infinite",
            }}
            />
        </div>
        </div>
    </section>
  );
}