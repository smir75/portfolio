import React, { useState } from "react";
import { Html } from "@react-three/drei";
import SimpleMiniMap from "@/scenes/ui/SimpleMiniMap";
import { useSettings } from "@/state/settings.jsx";

/**
 * Overlay full-screen (fixed, indépendant du zoom 3D).
 * - Navbar en haut (boutons -> onGo)
 * - Mini-map en bas-droite (taille fixe), clic -> event capté par Scene.jsx
 * - Panneau réglages (optionnel)
 */
export default function OverlayUI({ worldQuatRef, stations, onGo }) {
  const { settings, setSettings } = useSettings();
  const [open, setOpen] = useState(false);

  return (
    <Html fullscreen>
      {/* conteneur global, désactive le hit test sauf éléments ciblés */}
      <div className="pointer-events-none fixed inset-0 z-[60] select-none">

        {/* NAVBAR — top center, hors Canvas, ne bouge pas avec le zoom */}
        <div className="fixed top-0 left-0 right-0 flex items-center justify-center pointer-events-auto">
          <div className="px-3 py-2 mt-4 border shadow-xl rounded-2xl border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              {stations.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onGo?.(b.id)}
                  className="px-3 py-1.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
                  title={`Aller à ${b.label}`}
                >
                  {b.short}
                </button>
              ))}
              <div className="w-px h-6 mx-1 bg-slate-700" />
              <button
                onClick={() => setOpen((o) => !o)}
                className="px-3 py-1.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700 transition"
                title="Paramètres"
              >
                ⚙️ Réglages
              </button>
            </div>
          </div>
        </div>

        {/* MINI-MAP — bottom right, FIXED, taille constante */}
        <div className="fixed pointer-events-auto right-4 bottom-4">
          <SimpleMiniMap quatRef={worldQuatRef} stations={stations} size={160} />
        </div>

        {/* BADGE bas-gauche (optionnel) */}
        <div className="fixed left-4 bottom-4 text-[11px] text-slate-300/80">
          S.MIR’s Portfolio — Sagar.io
        </div>

        {/* RÉGLAGES — panneau discrete, fixe bas-droite au dessus de la mini-map */}
        {open && (
          <div className="pointer-events-auto fixed right-4 bottom-[200px] w-72 p-4 rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl">
            <div className="mb-2 text-sm font-semibold text-slate-100">Paramètres</div>

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

            <div className="mt-3 text-[11px] text-slate-400">
              Molette = zoom • + / − / 0 = zoomer / dézoomer / reset • Clic mini-map = viser.
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}
