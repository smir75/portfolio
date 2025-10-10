// src/scenes/ui/TopNav.jsx
import React, { useCallback } from "react";
import { dbg } from "@/utils/debug";

export default function TopNav({ stations = [] }) {
    const openQueued = useCallback((id) => {
    dbg("TopNav click → saga-open-station (queue)", { id });
    // Focus + queue open (ouvrira automatiquement quand aligné)
    window.dispatchEvent(new CustomEvent("saga-open-station", { detail: { id, timeout: 8000 } }));
  }, []);

  return (
    <div className="max-w-5xl px-3 py-2 mx-auto" data-ui-block-enter>
      <div className="flex items-center justify-between px-3 py-2 border shadow-lg rounded-2xl border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
        <div className="font-semibold tracking-wide text-slate-200">S.MIR — Portfolio</div>
        <nav className="flex gap-1 sm:gap-2">
          {stations.map((s) => (
            <button
              key={s.id}
              type="button"
              title={`Aller à ${s.label}`}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-700/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/70 transition"
              onClick={(e) => { e.stopPropagation(); openQueued(s.id); }}   
              onKeyDown={(e) => {
                // ❌ pas d’Enter/Espace qui ouvre ici
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {s.short}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
