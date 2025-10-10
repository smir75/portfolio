// src/pages/Projets.jsx
import React, { useMemo, useState } from "react";
import PageClose from "@/scenes/ui/PageClose.jsx";

/* =========================
   UI Holo (comme sur BTS)
   ========================= */
const HoloCard = ({ children, className = "" }) => (
  <div
    className={
      "relative rounded-2xl border overflow-hidden " +
      "border-cyan-400/20 bg-gradient-to-b from-slate-900/60 to-slate-950/70 " +
      "backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,.35)] " +
      "before:absolute before:inset-0 before:pointer-events-none " +
      "before:bg-[radial-gradient(1200px_400px_at_20%_-10%,rgba(56,189,248,.12),transparent_60%)] " +
      className
    }
  >
    <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-cyan-300/10" />
    {children}
  </div>
);

const HoloDivider = ({ className = "" }) => (
  <div className={"relative h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent " + className}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent animate-pulse [animation-duration:2.6s]" />
  </div>
);

const Button = ({ className = "", glow = false, ...p }) => (
  <button
    className={
      "px-3 py-1.5 rounded-xl border transition " +
      (glow
        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20 shadow-[0_0_20px_rgba(56,189,248,.18)]"
        : "border-slate-700/60 bg-slate-900/60 text-slate-100 hover:bg-slate-800/70") +
      " " + className
    }
    {...p}
  />
);

/* =========================
   Icônes inline (stack)
   ========================= */
const icons = {
  Laravel: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#FF2D20" d="M92 12l24 14v28L68 86 44 72V44l24-14L92 12zM20 32l24 14v28L20 60V32z"/>
    </svg>
  ),
  Node: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#83CD29" d="M64 .6L5.8 34.1v59.2L64 126.6l58.2-33.3V34.1z"/>
      <path fill="#111827" d="M64 15.2l44.8 25.7v46.2L64 112.8 19.2 87V41z"/>
    </svg>
  ),
  React: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <circle cx="64" cy="64" r="10" fill="#67E8F9"/>
      <g fill="none" stroke="#22D3EE" strokeWidth="6">
        <ellipse cx="64" cy="64" rx="50" ry="20"/>
        <ellipse cx="64" cy="64" rx="50" ry="20" transform="rotate(60 64 64)"/>
        <ellipse cx="64" cy="64" rx="50" ry="20" transform="rotate(120 64 64)"/>
      </g>
    </svg>
  ),
  R3F: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path d="M64 16l48 28v40L64 112 16 84V44z" fill="#7DD3FC"/>
      <path d="M64 32l32 18v28L64 96 32 78V50z" fill="#0EA5E9"/>
    </svg>
  ),
  Three: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#60A5FA" d="M20 96l44-76 44 76H20z"/>
      <path fill="#1D4ED8" d="M64 88l26-44 26 44H64z"/>
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <rect x="8" y="60" width="112" height="28" rx="6" fill="#38BDF8"/>
      <rect x="28" y="44" width="16" height="12" fill="#0EA5E9"/>
      <rect x="46" y="44" width="16" height="12" fill="#0EA5E9"/>
      <rect x="64" y="44" width="16" height="12" fill="#0EA5E9"/>
    </svg>
  ),
  Git: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#F05032" d="M7 64L64 7l57 57-57 57z"/>
      <circle cx="64" cy="64" r="8" fill="#fff"/>
      <circle cx="64" cy="32" r="8" fill="#fff"/>
      <circle cx="64" cy="96" r="8" fill="#fff"/>
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="#e5e7eb" d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 00-1.34-1.76c-1.09-.74.08-.73.08-.73a2.52 2.52 0 011.84 1.24A2.55 2.55 0 009 19.54a2.55 2.55 0 01.76-1.6c-2.66-.3-5.47-1.33-5.47-5.93A4.64 4.64 0 016 8.27a4.3 4.3 0 01.12-3.17s1-.32 3.3 1.23a11.36 11.36 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.6.24 2.85.12 3.17a4.64 4.64 0 011.23 3.34c0 4.6-2.81 5.62-5.49 5.92a2.85 2.85 0 01.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0012 .5z"/>
    </svg>
  ),
  VSCode: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#3B82F6" d="M16 80l24 16 56-56V16L40 56 16 40z"/>
      <path fill="#1D4ED8" d="M96 16v96L40 88V56z"/>
    </svg>
  ),
  MySQL: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#2563EB" d="M20 96c16-28 44-48 72-52 8 0 12 4 16 10-18 2-36 12-48 26 12 2 22 4 32 10-16 12-36 18-56 16-8-2-14-6-16-10z"/>
      <circle cx="100" cy="48" r="6" fill="#1E3A8A" />
    </svg>
  ),
  MongoDB: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#10B981" d="M64 8s-3.3 60.2-30 77.6C50.7 92.3 57.9 112 64 120c6.1-8 13.3-27.7 30-34.4C67.3 68.2 64 8 64 8z"/>
      <path fill="#064E3B" d="M64 120c-4.3-5.8-8.6-14.7-12-24 4.6-3.5 8.2-8.5 12-16 3.8 7.5 7.4 12.5 12 16-3.4 9.3-7.7 18.2-12 24z"/>
    </svg>
  ),
  Postgres: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <ellipse cx="64" cy="64" rx="44" ry="30" fill="#334155"/>
      <path d="M32 72c8-8 24-12 32-12s24 4 32 12" stroke="#60A5FA" strokeWidth="4" fill="none"/>
    </svg>
  ),
  Nginx: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#16A34A" d="M64 8l56 32v48L64 120 8 88V40z"/>
      <path fill="#052e16" d="M40 44h16l16 28 16-28h16L72 96H56z"/>
    </svg>
  ),
  Redis: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <rect x="20" y="44" width="88" height="40" rx="6" fill="#ef4444"/>
      <rect x="28" y="52" width="24" height="8" fill="#7f1d1d"/>
      <circle cx="88" cy="64" r="6" fill="#7f1d1d"/>
    </svg>
  ),
  Ubuntu: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <circle cx="64" cy="64" r="44" fill="#f97316"/>
      <circle cx="64" cy="64" r="10" fill="#fff"/>
    </svg>
  ),
  Windows: (
    <svg viewBox="0 0 128 128" className="w-4 h-4">
      <path fill="#60A5FA" d="M16 24l44-8v44H16zM64 16l48-8v52H64zM16 68h44v44l-44-8zM64 68h48v52l-48-8z"/>
    </svg>
  ),
};

const TechPill = ({ name }) => (
  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs border-cyan-400/30 bg-cyan-400/10 text-cyan-100">
    <span className="shrink-0">{icons[name] ?? <span className="w-4 h-4 rounded bg-cyan-300/40" />}</span>
    {name}
  </span>
);

/* =========================
   Données projets (dev only)
   ========================= */
const PROJECTS = [
  {
    id: "intranet-wad-as400",
    titre: "Intranet Entreprise — WAD ↔ AS400",
    pitch: "Portail interne (auth, rôles, workflows) avec intégration AS400 (lecture/écriture sécurisée) et annuaire (AD/LDAP).",
    techno: ["Laravel", "MySQL", "Docker", "Nginx", "Git", "GitHub", "VSCode", "Ubuntu"],
    details: [
      "Back Laravel (policies/guards), REST endpoints, pagination lourde",
      "Connecteurs AS400 (formatage, mapping, retry) + cache Redis",
      "ACL par rôles, audit log, exports CSV/PDF",
    ],
    kpis: [{ k: "Endpoints", v: 32 }, { k: "RPS max", v: "120+" }, { k: "Temps moyen", v: "≈120ms" }],
    screenshotsSlot: true,
  },
  {
    id: "api-logistique",
    titre: "API Logistique — microservice Node/Mongo",
    pitch: "Service d’agrégation données (stocks, colis) avec indexation, TTL et webhooks.",
    techno: ["Node", "MongoDB", "Docker", "GitHub", "VSCode", "Ubuntu"],
    details: [
      "Schemas Mongoose, index combinés, TTL cleanup",
      "Webhook de mise à jour → workers queue (bullmq)",
      "JWT, CORS strict, rate-limit",
    ],
    kpis: [{ k: "Collections", v: 5 }, { k: "Latence P50", v: "≈80ms" }, { k: "Jobs/Jour", v: "10k+" }],
    screenshotsSlot: true,
  },
  {
    id: "portfolio-spatial",
    titre: "Portfolio Spatial (3D)",
    pitch: "Expérience 3D (React Three Fiber) — stations ↔ auto-aim, moon, HUD spatial.",
    techno: ["React", "R3F", "Three", "VSCode", "Git", "GitHub"],
    details: [
      "Hook d’auto-alignement slerp (station ↔ +Z) + queue open",
      "HUD/TopNav glass, triggers CustomEvent, pages holo",
      "Optimisations: frustum culling, DPR, reduced motion",
    ],
    kpis: [{ k: "FPS cible", v: "60" }, { k: "Stations", v: 5 }, { k: "Hooks custom", v: 8 }],
    screenshotsSlot: true,
  },
  {
    id: "etl-automations",
    titre: "ETL & Automations",
    pitch: "Jobs d’intégration et transformation planifiés (exports, nettoyage, agrégations).",
    techno: ["Node", "Postgres", "MongoDB", "Docker", "GitHub"],
    details: [
      "Planification (cron), normalisation, validation",
      "Alerting simple (webhook Discord/Slack)",
      "Reporting CSV/JSON, historisation",
    ],
    kpis: [{ k: "Pipelines", v: 6 }, { k: "Vol/jour", v: "200k+" }, { k: "Échecs", v: "<0.2%" }],
    screenshotsSlot: true,
  },
  {
    id: "cicd-containers",
    titre: "CI/CD & Conteneurs",
    pitch: "Workflows GitHub Actions, images Docker, multi-env (preprod/prod), healthchecks.",
    techno: ["Docker", "GitHub", "Nginx", "Ubuntu"],
    details: [
      "Build & push images (tags semver), cache layers",
      "Déploiement blue/green, check readiness/liveness",
      "Reverse proxy Nginx (gzip, cache, headers sécu)",
    ],
    kpis: [{ k: "Workflows", v: 4 }, { k: "Images", v: 7 }, { k: "Rollback", v: "<2min" }],
    screenshotsSlot: true,
  },
  {
    id: "monitoring-dashboard",
    titre: "Dashboard Monitoring",
    pitch: "Tableaux de bord technique (status API, jobs, files) avec seuils et badges.",
    techno: ["React", "Node", "Docker", "Ubuntu"],
    details: [
      "Probes/heartbeats, synthèse statuts, heatmaps",
      "Filtres, tri, exports CSV",
      "Notifications de dérive basiques",
    ],
    kpis: [{ k: "Probes", v: 18 }, { k: "Temps refresh", v: "15s" }, { k: "Exports", v: "CSV" }],
    screenshotsSlot: true,
  },
];

/* =========================
   Composants
   ========================= */
const TechStackRow = ({ list = [] }) => (
  <div className="flex flex-wrap gap-1.5">
    {list.map((t) => <TechPill key={t} name={t} />)}
  </div>
);

const KPIs = ({ list = [] }) => (
  <div className="grid grid-cols-3 gap-2">
    {list.map((m, i) => (
      <div key={i} className="rounded-lg border border-cyan-400/20 bg-slate-900/40 px-2.5 py-1.5 text-center">
        <div className="text-xs text-slate-400">{m.k}</div>
        <div className="text-sm font-medium text-cyan-100">{m.v}</div>
      </div>
    ))}
  </div>
);

const ScreenshotSlot = () => (
  <div className="p-3 mt-2 text-xs border rounded-xl border-cyan-400/20 bg-slate-950/40 text-slate-400">
    Zone screenshots — colle tes captures ici (drag & drop/image grid à venir).
  </div>
);

/* =========================
   Page Projets
   ========================= */
export default function Projets() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");

  const tags = useMemo(() => {
    const all = new Set(["all"]);
    PROJECTS.forEach(p => p.techno.forEach(t => all.add(t)));
    return Array.from(all);
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PROJECTS.filter(p => {
      const matchTag = tag === "all" || p.techno.includes(tag);
      const matchQ = !query
        ? true
        : (p.titre + " " + p.pitch + " " + p.techno.join(" ") + " " + p.details.join(" "))
            .toLowerCase().includes(query);
      return matchTag && matchQ;
    });
  }, [q, tag]);

  return (
    <div className="page-glass">
      {/* Header */}
      <header className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <h2 className="text-2xl tracking-widest font-orbitron holo-title">Projets</h2>
            <p className="text-sm text-slate-400">Sélection de réalisations dev • Holo UI</p>
            <span className="absolute -left-2 -top-2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,.9)]" />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={()=>window.print()}>⤓ Export</Button>
            <PageClose />
          </div>
        </div>

        <HoloDivider className="my-3" />

        {/* Logos / Stack “mur” */}
        <div className="p-3 border rounded-2xl border-cyan-400/20 bg-slate-900/40">
          <div className="flex flex-wrap gap-2">
            {["Laravel","Node","React","R3F","Three","Docker","Git","GitHub","VSCode","MySQL","MongoDB","Postgres","Nginx","Redis","Ubuntu","Windows"].map(k => (
              <span key={k} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-cyan-400/20 bg-cyan-400/5 text-cyan-100">
                {icons[k]} <span className="text-xs">{k}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Filtres */}
        <div className="grid gap-3 mt-3 sm:grid-cols-3">
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Rechercher projet/techno/détail…"
            className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-900/70 border-cyan-400/20 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 sm:col-span-2"
          />
          <div className="flex gap-2">
            <select
              value={tag}
              onChange={(e)=>setTag(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-900/70 border-cyan-400/20 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
            >
              {tags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Button onClick={()=>{ setQ(""); setTag("all"); }}>Reset</Button>
          </div>
        </div>
      </header>

      {/* Liste projets */}
      <section className="grid gap-4 p-4 pt-0 md:grid-cols-2">
        {filtered.map(p => (
          <HoloCard key={p.id}>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="tracking-wide font-orbitron">{p.titre}</h3>
                  <p className="text-xs text-slate-400">{p.pitch}</p>
                </div>
                <div className="hidden sm:block">
                  <KPIs list={p.kpis} />
                </div>
              </div>

              <TechStackRow list={p.techno} />

              <ul className="mt-1 space-y-1.5 text-sm text-slate-300">
                {p.details.map((d, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              {/* KPIs en mobile */}
              <div className="sm:hidden">
                <KPIs list={p.kpis} />
              </div>

              {p.screenshotsSlot && <ScreenshotSlot />}
            </div>
          </HoloCard>
        ))}
        {filtered.length === 0 && (
          <div className="p-6 text-sm text-slate-400 opacity-80">Aucun projet pour ce filtre.</div>
        )}
      </section>
    </div>
  );
}
