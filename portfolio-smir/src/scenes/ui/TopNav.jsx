// src/scenes/ui/TopNav.jsx
import React, { useCallback } from "react";

export default function TopNav({ stations = [], onGo }) {
  const focus = useCallback((id) => {
    // focus = aligne la planète
    window.dispatchEvent(new CustomEvent("saga-focus-station", { detail: { id } }));
    onGo?.(id); // compat ancien comportement
  }, [onGo]);

  const open = useCallback((id) => {
    // open = navigation après alignement (géré par Scene + App)
    window.dispatchEvent(new CustomEvent("saga-open-station", { detail: { id } }));
  }, []);

  return (
    <div className="max-w-5xl px-3 py-2 mx-auto">
      <div className="flex items-center justify-between px-3 py-2 border shadow-lg rounded-2xl border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
        <div className="font-semibold tracking-wide text-slate-200">S.MIR — Portfolio</div>
        <nav className="flex gap-1 sm:gap-2">
          {stations.map((s) => (
            <button
              key={s.id}
              type="button"
              title={`Aller à ${s.label}`}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-700/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/70 transition"
              onClick={(e) => {
                e.stopPropagation();
                if (e.detail >= 2) open(s.id); else focus(s.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                open(s.id);
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
