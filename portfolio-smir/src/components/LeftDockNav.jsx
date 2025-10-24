// src/components/LeftDockNav.jsx
import React, { useEffect, useRef, useState } from "react";

const ITEMS = [
  { id: "hero",           label: "Accueil",        icon: "home" },
  { id: "about",          label: "À propos",       icon: "id" },
  { id: "bts",            label: "BTS SIO",        icon: "layers" },
  { id: "parcours",       label: "Mon parcours",   icon: "road" },
  { id: "projets",        label: "Mes projets",    icon: "briefcase" },
  { id: "certifications", label: "Certifications", icon: "award" },
  { id: "veille",         label: "Veille techno",  icon: "globe" },
  { id: "entreprise",     label: "Entreprise",     icon: "building" },
  { id: "ecole",          label: "Écoles",         icon: "school" },
  { id: "user-story",        label: "Profil",        icon: "user" },
];

function Icon({ name, className = "w-5 h-5" }) {
  switch (name) {
    case "home":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7" stroke="currentColor" strokeWidth="1.8"/><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.8"/></svg>);
    case "id":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="9" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M14 9h5M14 12h5M14 15h5" stroke="currentColor" strokeWidth="1.6"/></svg>);
    case "layers":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><path d="M12 2l9 5-9 5-9-5 9-5Z" stroke="currentColor" strokeWidth="1.8"/><path d="m21 12-9 5-9-5" stroke="currentColor" strokeWidth="1.8"/><path d="m21 17-9 5-9-5" stroke="currentColor" strokeWidth="1.8"/></svg>);
    case "road":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><path d="M6 22l4-20h4l4 20" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2v5m0 4v4m0 4v3" stroke="currentColor" strokeWidth="1.8"/></svg>);
    case "briefcase":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.8"/></svg>);
    case "award":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M8 14l-2 7 6-3 6 3-2-7" stroke="currentColor" strokeWidth="1.8"/></svg>);
    case "globe":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="1.6"/></svg>);
    case "building":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><path d="M18 21V8h2v13h-2Z" fill="currentColor"/></svg>);
    case "school":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><path d="m3 10 9-5 9 5-9 5-9-5Z" stroke="currentColor" strokeWidth="1.8"/><path d="M7 12v5l5 3 5-3v-5" stroke="currentColor" strokeWidth="1.8"/></svg>);
    case "user":
      return (<svg className={className} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8"/></svg>);
    default:
      return null;
  }
}

export default function LeftDockNav() {
  const [active, setActive] = useState("hero");
  const ioRef = useRef(null);

  const onScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Observer fiable (root par défaut = viewport)
  useEffect(() => {
    const sections = ITEMS.map(i => document.getElementById(i.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { root: null, threshold: 0.6 }
    );
    sections.forEach((sec) => obs.observe(sec));
    ioRef.current = obs;
    return () => obs.disconnect();
  }, []);

  return (
    <aside
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[121]"
      aria-label="Navigation latérale"
    >
      {/* Rail fixe, centré, sans expansion */}
      <div
        className="relative w-[64px] h-[84vh] ml-2 rounded-2xl border border-white/15 overflow-hidden backdrop-blur-md flex flex-col items-center"
        style={{
          background: "linear-gradient(180deg, rgba(13,19,39,.58), rgba(9,13,25,.58))",
          boxShadow: "0 10px 30px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.04)",
        }}
      >
        {/* marge top */}
        <div className="h-3" />

        {/* Liste icônes */}
        <nav className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <ul className="px-[6px] space-y-1.5">
            {ITEMS.map((it) => {
              const isActive = active === it.id;
              return (
                <li key={it.id} className="relative group">
                  {/* bord actif à gauche */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[3px] rounded-r ${isActive ? "bg-sky-400" : "bg-transparent"}`}
                    aria-hidden
                  />
                  <button
                    onClick={() => onScrollTo(it.id)}
                    className={`w-full h-10 rounded-xl flex items-center justify-center transition
                      ${isActive ? "bg-[#60a5fa]/20 text-[#e6f0ff]" : "text-slate-200 hover:bg-white/10"}`}
                    title={it.label}
                  >
                    <span className={`${isActive ? "text-[#60a5fa]" : "text-slate-200/90"}`}>
                      <Icon name={it.icon} />
                    </span>
                  </button>

                  {/* Tooltip à droite (propre et centré verticalement sur l’item) */}
                  <div className="pointer-events-none absolute left-[72px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="px-2 py-1 text-xs border rounded-md shadow-lg bg-black/70 text-slate-100 whitespace-nowrap border-white/10">
                      {it.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* marge bas */}
        <div className="h-3" />
      </div>
    </aside>
  );
}
