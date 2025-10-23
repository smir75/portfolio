import React, { useEffect, useMemo, useRef, useState } from "react";

const ITEMS = [
  { id: "hero",           label: "Accueil",           icon: "home" },
  { id: "about",          label: "À propos",          icon: "id" },
  { id: "bts",            label: "BTS SIO",           icon: "layers" },
  { id: "parcours",       label: "Mon parcours",      icon: "road" },
  { id: "projets",        label: "Mes projets",       icon: "briefcase" },
  { id: "certifications", label: "Certifications",    icon: "award" },
  { id: "veille",         label: "Veille techno",     icon: "globe" },
  { id: "entreprise",     label: "Entreprise",        icon: "building" },
  { id: "ecole",          label: "École",             icon: "school" },
  { id: "contact",        label: "Contact",           icon: "user" },
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
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState("hero");
  const hotzoneRef = useRef(null);

  const onScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Observer pour connaître la section active
  useEffect(() => {
    const sections = ITEMS.map(i => document.getElementById(i.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { root: document.querySelector(".snap-container") || null, threshold: 0.6 }
    );
    sections.forEach((sec) => obs.observe(sec));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* zone sensible mince au bord gauche */}
      <div
        ref={hotzoneRef}
        className="fixed left-0 top-0 h-screen w-[8px] z-[120]"
        onMouseEnter={() => setExpanded(true)}
      />

      <aside
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-[121] transition-[width,transform,opacity] duration-300
          ${expanded ? "w-[220px]" : "w-[56px]"} `}
        onMouseLeave={() => setExpanded(false)}
        aria-label="Navigation latérale"
      >
        {/* fond et bord */}
        <div
          className="relative h-[82vh] ml-2 rounded-2xl border border-white/15 bg-white/8 backdrop-blur-md overflow-hidden flex flex-col"
          style={{ background: "linear-gradient(180deg, rgba(13,19,39,.55), rgba(10,15,28,.55))" }}
        >
          {/* bouton hamburger/close */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-2 m-3 transition rounded-lg hover:bg-white/10 text-slate-100"
            aria-label={expanded ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {expanded ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2"/></svg>
            )}
          </button>

          {/* items */}
          <nav className="flex-1 mt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <ul className="px-2">
              {ITEMS.map((it) => {
                const isActive = active === it.id;
                return (
                  <li key={it.id} className="my-1">
                    <button
                      onClick={() => onScrollTo(it.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition
                        ${isActive ? "bg-[#60a5fa]/20 text-[#e6f0ff]" : "text-slate-200 hover:bg-white/10"}`}
                    >
                      <span className={`${isActive ? "text-[#60a5fa]" : "text-slate-200/90"}`}>
                        <Icon name={it.icon} />
                      </span>
                      <span className={`whitespace-nowrap transition-opacity ${expanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        {it.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* badge accessibilité/indice (optionnel) */}
          <div className="m-3">
            <div className={`rounded-xl px-3 py-2 text-[12px] text-slate-300/80 bg-white/5 ${expanded ? "opacity-100" : "opacity-0 pointer-events-none"} transition`}>
              Survolez pour ouvrir. Cliquez pour naviguer.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
