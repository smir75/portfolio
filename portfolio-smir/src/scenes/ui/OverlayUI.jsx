// src/scenes/ui/OverlayUI.jsx
import React, { useState } from "react";
import { useSettings } from "@/state/settings.jsx";

/**
 * Overlay DOM normal (hors <Canvas>).
 * - bouton Réglages bas-droite (fixed)
 * - panneau réglages
 * - badge bas-gauche
 */
export default function OverlayUI() {
  const { settings, setSettings } = useSettings();
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] select-none">
      {/* bouton Réglages — bas droite */}
      <div className="pointer-events-auto fixed right-4 bottom-4">
        <button
          onClick={() => setOpen(o => !o)}
          className="px-3 py-1.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
          title="Paramètres"
          aria-expanded={open}
          aria-controls="overlay-settings-panel"
        >
          ⚙️ Réglages
        </button>
      </div>

      {/* badge — bas gauche */}
      <div className="fixed left-4 bottom-4 text-[11px] text-slate-300/80">
        S.MIR’s Portfolio — Sagar.io
      </div>

      {/* panneau Réglages */}
      {open && (
        <div
          id="overlay-settings-panel"
          className="pointer-events-auto fixed right-4 bottom-16 w-72 p-4 rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl"
          role="dialog"
          aria-modal="false"
          aria-label="Paramètres d’affichage"
        >
          <div className="mb-2 text-sm font-semibold text-slate-100">Paramètres</div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-200">Qualité</span>
            <select
              className="px-2 py-1 border rounded-lg border-slate-600 bg-slate-800 text-slate-100"
              value={settings.quality}
              onChange={(e) => setSettings(s => ({ ...s, quality: e.target.value }))}
            >
              <option value="auto">Auto</option>
              <option value="high">Haute</option>
              <option value="low">Basse</option>
            </select>
          </div>

          <label className="flex items-center justify-between py-2">
            <span className="text-slate-200">Réduire mouvements</span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => setSettings(s => ({ ...s, reduceMotion: e.target.checked }))}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <span className="text-slate-200">Contraste élevé</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => setSettings(s => ({ ...s, highContrast: e.target.checked }))}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <span className="text-slate-200">Mode présentation</span>
            <input
              type="checkbox"
              checked={settings.presentation}
              onChange={(e) => setSettings(s => ({ ...s, presentation: e.target.checked }))}
            />
          </label>

          <div className="mt-3 text-[11px] text-slate-400">
            Molette = zoom • + / − / 0 = zoomer / dézoomer / reset.
          </div>
        </div>
      )}
    </div>
  );
}
