import { useState, useEffect, useContext } from "react";
import { NAV_LINKS, IDENTITY } from "../constants/data";
import { ThemeContext } from "../../hooks/ThemeProvider";
import { FaDownload } from "react-icons/fa";

export default function Navbar() {
    const [active, setActive] = useState("home");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [menuOpen, setMenuOpen] = useState(false);

    const { theme, toggleTheme } = useContext(ThemeContext);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  // Handle resize
    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth < 900);
        if (window.innerWidth >= 900) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const scrollTo = (href) => {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (!el) return;

        window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
        });

        setActive(id);
        setMenuOpen(false);
    };

    return (
        <div
        style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "1475px",
            padding: "0 16px",
            zIndex: 100,
            cursor: "default",
        }}
        >
        {/* NAVBAR */}
        <nav
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: scrolled ? "60px" : "70px",
            padding: "12px 16px",
            borderRadius: "16px",

            background:
                theme === "dark"
                ? "rgba(10,10,15,0.6)"
                : "transparent",

            backdropFilter:
                theme === "dark" ? "blur(20px)" : "blur(8px)",

            backdropFilter: scrolled ? "blur(20px)" : "blur(10px)",

            border:
                theme === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.06)",

            boxShadow:
                theme === "dark"
                ? "0 10px 40px rgba(0,0,0,0.5)"
                : "0 4px 20px rgba(0,0,0,0.08)",

            transition: "all 0.3s ease",
            }}
        >
            {/* LEFT LOGO */}
            <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: scrolled ? "8px" : "12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
            }}
            >
            {/* LOGO BOX */}
            <div
                style={{
                width: scrolled ? "32px" : "38px",
                height: scrolled ? "32px" : "38px",
                borderRadius: "10px",

                background: "linear-gradient(135deg, #6C63FF, #00D9B5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                fontWeight: "800",
                fontSize: scrolled ? "11px" : "13px",
                color: "#fff",
                fontFamily: "DM Mono",

                boxShadow: scrolled
                    ? "0 2px 10px rgba(108,99,255,0.3)"
                    : "0 6px 25px rgba(108,99,255,0.5)",

                transform: scrolled ? "scale(0.95)" : "scale(1)",
                transition: "all 0.3s ease",
                }}
            >
                {IDENTITY.initials}
            </div>

            {/* NAME */}
            <span
                style={{
                fontSize: scrolled ? "15px" : "17px",
                fontWeight: "600",
                letterSpacing: "-0.2px",
                color: theme === "dark" ? "#fff" : "#111",
                opacity: scrolled ? 0.9 : 1,
                transition: "all 0.3s ease",
                }}
            >
                {IDENTITY.name}
            </span>
            </div>

            {/* CENTER NAV (DESKTOP ONLY) */}
            {!isMobile && (
            <div style={{ display: "flex", gap: "24px" }}>
                {NAV_LINKS.map(({ label, href }) => {
                const id = href.slice(1);
                const isActive = active === id;

                return (
                    <button
                    key={href}
                    onClick={() => scrollTo(href)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        color:
                        theme === "dark"
                            ? isActive
                            ? "#fff"
                            : "rgba(255,255,255,0.6)"
                            : isActive
                            ? "#111"
                            : "rgba(0,0,0,0.6)",
                        position: "relative",
                        transition: "all 0.25s ease",
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                            theme === "dark" ? "#fff" : "#111";

                        e.currentTarget.style.transform = "translateY(-1px)";
                        }}

                        onMouseLeave={(e) => {
                        if (!isActive) {
                            e.currentTarget.style.color =
                            theme === "dark"
                                ? "rgba(255,255,255,0.6)"
                                : "rgba(0,0,0,0.6)";
                        }

                        e.currentTarget.style.transform = "translateY(0px)";
                        }}
                    >
                    {label}
                    {isActive && (
                        <span
                            style={{
                            position: "absolute",
                            bottom: "-6px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background:
                                "linear-gradient(90deg, #6C63FF, #00D9B5)",
                            }}
                        />
                        )}
                    </button>
                );
                })}
            </div>
            )}

            {/* RIGHT SECTION */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            
            {/* THEME TOGGLE */}
            <div
                onClick={toggleTheme}
                style={{
                width: "52px",
                height: "28px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                padding: "3px",
                cursor: "pointer",
                position: "relative",
                }}
            >
                <span
                style={{
                    position: "absolute",
                    left: "6px",
                    fontSize: "12px",
                    opacity: theme === "dark" ? 1 : 0.6,
                }}
                >
                🌙
                </span>

                <span
                style={{
                    position: "absolute",
                    right: "6px",
                    fontSize: "12px",
                    opacity: theme === "light" ? 1 : 0.6,
                }}
                >
                ☀️
                </span>

                <div
                style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6C63FF, #00D9B5)",
                    transform:
                    theme === "dark"
                        ? "translateX(0px)"
                        : "translateX(24px)",
                    transition: "0.3s",
                }}
                />
            </div>

            {/* RESUME BUTTON (DESKTOP ONLY) */}
            {!isMobile && (
                <a
                    href="/My_Resume.pdf"
                    download
                    style={{
                    position: "relative",
                    overflow: "hidden",

                    display: "flex",
                    alignItems: "center",
                    gap: "6px",

                    padding: "8px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: theme === "dark" ? "#fff" : "#111",
                    textDecoration: "none",

                    background:
                        theme === "dark"
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.04)",

                    border:
                        theme === "dark"
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(0,0,0,0.08)",

                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#00AFFF";
                    e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(0,170,255,0.3)";
                    }}
                    onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                        theme === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {/* 🔥 SHINE LAYER */}
                    <span
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background:
                        "linear-gradient(120deg, transparent, rgba(255,255,255,0.25), transparent)",
                        transform: "skewX(-20deg)",
                        animation: "shine 3s infinite",
                    }}
                    />

                    {/* CONTENT */}
                    <FaDownload style={{ zIndex: 1 }} />
                    <span style={{ zIndex: 1 }}>Resume</span>
                </a>
                )}

            {/* MENU BUTTON (MOBILE) */}
            {isMobile && (
                <div
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                }}
                >
                ☰
                </div>
            )}
            </div>
        </nav>

        {/* MOBILE MENU */}
        {isMobile && menuOpen && (
            <div
            style={{
                marginTop: "10px",
                borderRadius: "12px",
                padding: "12px",
                background:
                theme === "dark"
                    ? "rgba(10,10,15,0.9)"
                    : "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
            }}
            >
            {NAV_LINKS.map(({ label, href }) => (
                <div
                key={href}
                onClick={() => scrollTo(href)}
                style={{
                    padding: "10px",
                    cursor: "pointer",
                    color: theme === "dark" ? "#fff" : "#111",
                }}
                >
                {label}
                </div>
            ))}

            {/* Resume inside mobile */}
            <a
                href="/My_Resume.pdf"
                download
                style={{
                display: "block",
                marginTop: "10px",
                padding: "10px",
                textDecoration: "none",
                color: theme === "dark" ? "#fff" : "#111",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                }}
            >
                <div className="flex items-center gap-2">
                    <FaDownload /> Download Resume
                </div>
            </a>
            </div>
        )}
        </div>
    );
}