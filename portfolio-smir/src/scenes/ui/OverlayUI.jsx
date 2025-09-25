// src/scenes/ui/OverlayUI.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useSettings } from "@/state/settings.jsx";

/**
 * Overlay DOM rendu via un portal directement dans <body>.
 * Avantages :
 * - Toujours au-dessus du Canvas et des <Html> de drei
 * - Indépendant du z-index du conteneur 3D ou de la TopNav
 *
 * Contenu :
 * - Bouton "⚙️ Réglages" fixé en bas-droite
 * - Panneau de réglages (qualité, accessibilité, etc.)
 * - Badge discret en bas-gauche
 */
export default function OverlayUI() {
  const { settings, setSettings } = useSettings();
  const [open, setOpen] = useState(false);

  // Un z-index très haut pour dominer toute la scène,
  // mais comme on est dans <body> via portal, ça suffit largement.
  const Z_TOP = 5000;

  return createPortal(
    <>
      {/* === Bouton Réglages — bas droite === */}
      <div
        style={{ position: "fixed", right: 16, bottom: 16, zIndex: Z_TOP }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-3 py-1.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition shadow-lg"
          title="Paramètres"
          aria-expanded={open}
          aria-controls="overlay-settings-panel"
        >
          ⚙️ Réglages
        </button>
      </div>

      {/* === Panneau Réglages — apparaît au-dessus du bouton === */}
      {open && (
        <div
          id="overlay-settings-panel"
          style={{ position: "fixed", right: 16, bottom: 64, zIndex: Z_TOP, width: 288 }}
          className="p-4 border shadow-2xl rounded-2xl border-slate-700 bg-slate-900/95"
          role="dialog"
          aria-modal="false"
          aria-label="Paramètres d’affichage"
        >
          <div className="mb-2 text-sm font-semibold text-slate-100">Paramètres</div>

          {/* Qualité de rendu */}
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-200">Qualité</span>
            <select
              className="px-2 py-1 border rounded-lg border-slate-600 bg-slate-800 text-slate-100"
              value={settings.quality}
              onChange={(e) => setSettings((s) => ({ ...s, quality: e.target.value }))}
            >
              <option value="auto">Auto</option>
              <option value="high">Haute</option>
              <option value="low">Basse</option>
            </select>
          </div>

          {/* Accessibilité / confort */}
          <label className="flex items-center justify-between py-2">
            <span className="text-slate-200">Réduire mouvements</span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => setSettings((s) => ({ ...s, reduceMotion: e.target.checked }))}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <span className="text-slate-200">Contraste élevé</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => setSettings((s) => ({ ...s, highContrast: e.target.checked }))}
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <span className="text-slate-200">Mode présentation</span>
            <input
              type="checkbox"
              checked={settings.presentation}
              onChange={(e) => setSettings((s) => ({ ...s, presentation: e.target.checked }))}
            />
          </label>

          {/* Aide / raccourcis */}
          <div className="mt-3 text-[11px] text-slate-300/90 leading-relaxed">
            <div className="mb-1 font-semibold">Commandes</div>
            <ul className="pl-4 space-y-1 list-disc">
              <li><strong>Déplacement</strong> : ZQSD / WASD / Flèches</li>
              <li><strong>Saut</strong> : Espace</li>
              <li><strong>Entrer dans un module</strong> : Entrée (ou clic sur le module)</li>
              <li><strong>Se déplacer vers un point</strong> : Clic sur la planète</li>
            </ul>
          </div>
        </div>
      )}

      {/* === Badge — bas gauche === */}
      <div
        style={{ position: "fixed", left: 16, bottom: 16, zIndex: Z_TOP, pointerEvents: "none" }}
        className="text-[11px] text-slate-300/80"
      >
        S.MIR’s Portfolio — Sagar.io
      </div>
    </>,
    document.body
  );
}
