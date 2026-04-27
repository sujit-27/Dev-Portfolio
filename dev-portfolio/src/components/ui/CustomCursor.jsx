import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const outerRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      const { clientX, clientY } = e;

      // 🔹 inner dot (fast)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
      }

      // 🔹 outer ring (slightly delayed = smooth effect)
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* 🔵 OUTER RING */}
      <div
        ref={outerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: "2px solid rgba(0, 170, 255, 0.6)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "transform 0.15s ease-out",
        }}
      />

      {/* 🔵 INNER DOT */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#00AFFF",
          boxShadow: "0 0 15px #00AFFF",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "transform 0.05s linear",
        }}
      />
    </>
  );
}