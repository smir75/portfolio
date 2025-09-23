// src/components/SettingsDrawer.jsx
import React, { useState } from "react";
import { useSettings } from "../state/settings";

export default function SettingsDrawer() {
  const { settings, setSettings } = useSettings();
  const [open, setOpen] = useState(false);

  const Item = ({ label, children }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-slate-200">{label}</span>
      <div>{children}</div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed left-3 top-3 z-50 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-1.5 text-slate-100 hover:bg-slate-800/80"
        aria-label="Ouvrir les paramètres"
      >
        ⚙️
      </button>

      {open && (
        <div
          className="fixed left-3 top-12 z-50 w-72 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-xl"
          role="dialog"
          aria-label="Paramètres"
        >
          <div className="mb-2 text-sm font-semibold text-slate-100">Paramètres</div>

          <Item label="Qualité">
            <select
              className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-slate-100"
              value={settings.quality}
              onChange={(e) => setSettings((s) => ({ ...s, quality: e.target.value }))}
            >
              <option value="auto">Auto</option>
              <option value="high">Haute</option>
              <option value="low">Basse</option>
            </select>
          </Item>

          <Item label="Réduire les mouvements">
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(e) => setSettings((s) => ({ ...s, reduceMotion: e.target.checked }))}
            />
          </Item>

          <Item label="Contraste élevé">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => setSettings((s) => ({ ...s, highContrast: e.target.checked }))}
            />
          </Item>

          <Item label="Mode présentation">
            <input
              type="checkbox"
              checked={settings.presentation}
              onChange={(e) => setSettings((s) => ({ ...s, presentation: e.target.checked }))}
            />
          </Item>

          <Item label="Langue">
            <select
              className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-slate-100"
              value={settings.language}
              onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </Item>

          <div className="mt-3 text-right">
            <button
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1 text-slate-100 hover:bg-slate-700"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
