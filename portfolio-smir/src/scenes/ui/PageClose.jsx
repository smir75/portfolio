// src/scenes/ui/PageClose.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PageClose({
  className = "",
  title = "Fermer et revenir à la planète",
}) {
  const navigate = useNavigate();

  const onClose = () => {
    // Stopper tout focus/auto-aim en cours
    try {
      window.dispatchEvent(new CustomEvent("saga-focus-station", { detail: { id: null } }));
    } catch {}
    // Revenir à la Home (planète), PAS la landing (car entered=true reste mémorisé)
    navigate("/");
  };

  return (
    <button
      type="button"
      onClick={onClose}
      title={title}
      className={
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700/60 " +
        "bg-slate-900/60 hover:bg-slate-800/70 text-slate-200 transition " +
        "shadow-sm " + className
      }
      style={{ backdropFilter: "blur(6px)" }}
    >
      <span className="text-sm">Fermer</span>
      <span aria-hidden className="text-lg leading-none">✕</span>
    </button>
  );
}
