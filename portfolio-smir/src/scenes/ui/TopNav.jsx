import React from "react";

export default function TopNav({ stations, onGo }) {
  return (
    <div className="max-w-5xl px-3 py-2 mx-auto">
      <div className="flex items-center justify-between px-3 py-2 border shadow-lg rounded-2xl border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
        <div className="font-semibold tracking-wide text-slate-200">S.MIR — Portfolio</div>
        <nav className="flex gap-1 sm:gap-2">
          {stations.map((s) => (
            <button
              key={s.id}
              onClick={(e) => { e.stopPropagation(); onGo?.(s.id); }}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-700/60 bg-slate-800/70 text-slate-100 hover:bg-slate-700/70 transition"
              title={`Aller à ${s.label}`}
            >
              {s.short}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
