// src/scenes/ui/Modal.jsx
import React from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  // portal dans <body> → pas de dépendance à R3F/drei
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Fenêtre"}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-lg p-4 border shadow-2xl w/full rounded-2xl border-slate-700 bg-slate-900 text-slate-100"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="px-2 py-1 border rounded-lg border-slate-600 bg-slate-800 hover:bg-slate-700"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        <div className="text-slate-300">{children}</div>
      </div>
    </div>,
    document.body
  );
}
