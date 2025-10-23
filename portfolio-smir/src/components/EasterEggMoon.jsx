import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EasterEggMoon() {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-[999] cursor-pointer select-none"
      onClick={() => navigate("/lunar")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Easter egg lunaire"
    >
      {/* halo / glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
          hover ? "opacity-80 scale-125" : "opacity-30 scale-100"
        }`}
        style={{
          background: hover
            ? "radial-gradient(closest-side,#60a5fa55,#d4af3722,transparent)"
            : "radial-gradient(closest-side,#d4af3715,transparent)",
        }}
      ></div>

      {/* Lune */}
      <div
        className={`relative w-12 h-12 rounded-full bg-gradient-to-br from-[#e0e7ff] via-[#aab7d4] to-[#6b7280] shadow-lg transition-transform duration-700 ${
          hover ? "rotate-12 scale-110" : "rotate-0 scale-100"
        }`}
        style={{
          boxShadow:
            hover
              ? "0 0 25px 8px rgba(212,175,55,0.35)"
              : "0 0 12px 4px rgba(96,165,250,0.25)",
        }}
      >
        {/* cratères */}
        <div className="absolute top-[30%] left-[35%] w-2 h-2 bg-[#9ca3af] rounded-full opacity-60"></div>
        <div className="absolute top-[60%] left-[50%] w-1.5 h-1.5 bg-[#94a3b8] rounded-full opacity-40"></div>
        <div className="absolute top-[40%] left-[20%] w-1 h-1 bg-[#94a3b8] rounded-full opacity-50"></div>
      </div>

      {/* mini légende visible au hover */}
      <div
        className={`text-[11px] text-slate-400 text-center mt-1 font-light transition-opacity ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        “Regardez la lune…”
      </div>
    </div>
  );
}
