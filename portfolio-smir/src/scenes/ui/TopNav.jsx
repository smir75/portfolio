// src/scenes/ui/TopNav.jsx
import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dbg } from "@/utils/debug";

export default function TopNav({ stations = [] }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const openQueued = useCallback(
    (id) => {
      dbg("TopNav click", { id, from: pathname });

      const isOnLunar = pathname.startsWith("/lunar");
      if (!isOnLunar || pathname !== "/lunar") {
        // Optionnel: stop/clear focus en cours (propre)
        try {
          window.dispatchEvent(new CustomEvent("saga-focus-station", { detail: { id: null } }));
        } catch {}


        navigate("/lunar");

        // 2) Puis on queue l'ouverture à la frame suivante
        //    (la scène est visible, l'alignement démarre)
        requestAnimationFrame(() => {
          dbg("TopNav → saga-open-station (queued after goto /lunar)", { id });
          window.dispatchEvent(
            new CustomEvent("saga-open-station", {
              detail: { id, timeout: 8000 },
            })
          );
        });
      } else {
        // Déjà sur la Home → pas besoin de fermer, on queue direct
        dbg("TopNav → saga-open-station (direct on /lunar)", { id });
        window.dispatchEvent(
          new CustomEvent("saga-open-station", { detail: { id, timeout: 8000 } })
        );
      }
    },
    [pathname, navigate]
  );

  return (
    <div className="max-w-5xl px-3 py-2 mx-auto top-nav-glass" data-ui-block-enter>
      <div className="flex items-center justify-between px-3 py-2 border shadow-lg rounded-2xl border-slate-700/60 bg-slate-900/20 backdrop-blur-md">
        {/* Brand */}
        <div className="brand-chip no-select">
          <span className="brand-dot" />
          <span className="brand-text font-orbitron">S.MIR — Portfolio</span>
          <span className="brand-sub">orbit-ui</span>
        </div>

        {/* Nav */}
        <nav className="nav-rail">
          {stations.map((s) => (
            <button
              key={s.id}
              type="button"
              title={`Aller à ${s.label}`}
              className="topnav-item"
              data-active={
                (pathname === "/Projets"     && s.id === "projets")     ||
                (pathname === "/Competences" && s.id === "competences") ||
                (pathname === "/Parcours"    && s.id === "parcours")    ||
                (pathname === "/Contact"     && s.id === "contact")     ||
                (pathname === "/BTS"         && s.id === "bts")
                  ? "true"
                  : "false"
              }
              onClick={(e) => {
                e.stopPropagation();
                openQueued(s.id);
              }}
              onKeyDown={(e) => {
                // on évite Enter/Espace qui peuvent déclencher un "click" navigateur
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <span className="topnav-pill">
                <span className="topnav-dot" aria-hidden />
                <span className="topnav-text font-orbitron">{s.short}</span>
              </span>
              <span className="topnav-underline" aria-hidden />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
