// src/pages/Competences.jsx
import React, { useMemo, useState } from "react";
import PageClose from "@/scenes/ui/PageClose.jsx";

const CATEGORIES = [
  { key: "backend",  label: "Back-end",   color: "from-cyan-500/20 to-cyan-900/10", glow: "shadow-[0_0_24px_rgba(34,211,238,.25)]" },
  { key: "frontend", label: "Front-end",  color: "from-violet-500/20 to-violet-900/10", glow: "shadow-[0_0_24px_rgba(139,92,246,.25)]" },
  { key: "devops",   label: "DevOps",     color: "from-emerald-500/20 to-emerald-900/10", glow: "shadow-[0_0_24px_rgba(16,185,129,.25)]" },
  { key: "tools",    label: "Outils",     color: "from-sky-500/20 to-sky-900/10", glow: "shadow-[0_0_24px_rgba(56,189,248,.25)]" },
];

const SKILLS = [
  // Backend
  { id:"laravel",  label:"Laravel",         cat:"backend",  level:.86, tags:["Eloquent","Sanctum","Queues"] },
  { id:"node",     label:"Node.js",         cat:"backend",  level:.78, tags:["Express","REST","JWT"] },
  { id:"php",      label:"PHP",             cat:"backend",  level:.82, tags:["OOP","PSR","Composer"] },
  { id:"mysql",    label:"MySQL",           cat:"backend",  level:.80, tags:["Indexation","Schema","Views"] },
  { id:"mongo",    label:"MongoDB",         cat:"backend",  level:.65, tags:["Aggregations","Indexes"] },

  // Frontend
  { id:"react",    label:"React",           cat:"frontend", level:.84, tags:["Hooks","R3F","SPA"] },
  { id:"vue",      label:"Vue 3",           cat:"frontend", level:.72, tags:["Pinia","Vite"] },
  { id:"tailwind", label:"Tailwind",        cat:"frontend", level:.88, tags:["Design system","Responsive"] },
  { id:"three",    label:"Three / R3F",     cat:"frontend", level:.76, tags:["Shaders (basics)","GLTF"] },

  // DevOps
  { id:"docker",   label:"Docker",          cat:"devops",   level:.74, tags:["Compose","Build","Volumes"] },
  { id:"nginx",    label:"Nginx",           cat:"devops",   level:.62, tags:["Reverse proxy","TLS"] },
  { id:"git",      label:"Git / GitHub",    cat:"devops",   level:.86, tags:["Flow","Actions (basics)"] },
  { id:"windows",  label:"Windows Server",  cat:"devops",   level:.58, tags:["AD/LDAP","IIS (bases)"] },

  // Outils
  { id:"vscode",   label:"VS Code",         cat:"tools",    level:.90, tags:["Debug","Tasks","Extensions"] },
  { id:"postman",  label:"Postman",         cat:"tools",    level:.82, tags:["Collections","Tests"] },
  { id:"vm",       label:"VMware/VirtualBox", cat:"tools",  level:.66, tags:["Snapshots","Networks"] },
];

const LOGOS = {
  laravel: "https://cdn.simpleicons.org/laravel",
  node:    "https://cdn.simpleicons.org/nodedotjs",
  php:     "https://cdn.simpleicons.org/php",
  mysql:   "https://cdn.simpleicons.org/mysql",
  mongo:   "https://cdn.simpleicons.org/mongodb",
  react:   "https://cdn.simpleicons.org/react",
  vue:     "https://cdn.simpleicons.org/vuedotjs",
  tailwind:"https://cdn.simpleicons.org/tailwindcss",
  three:   "https://cdn.simpleicons.org/threedotjs",
  docker:  "https://cdn.simpleicons.org/docker",
  nginx:   "https://cdn.simpleicons.org/nginx",
  git:     "https://cdn.simpleicons.org/git",
  windows: "https://cdn.simpleicons.org/windows",
  vscode:  "https://cdn.simpleicons.org/visualstudiocode",
  postman: "https://cdn.simpleicons.org/postman",
  vm:      "https://cdn.simpleicons.org/virtualbox",
};

const Pill = ({ children }) => (
  <span className="px-2 py-0.5 text-[11px] rounded-md border border-cyan-400/30 text-cyan-200/90 bg-cyan-400/10">
    {children}
  </span>
);

const Gauge = ({ value=0.7 }) => (
  <div className="w-full h-2 overflow-hidden border rounded-full bg-slate-800/60 border-slate-700/60">
    <div
      className="h-full bg-cyan-400/80"
      style={{ width:`${Math.round(value*100)}%`, boxShadow:"0 0 20px rgba(56,189,248,.45)" }}
    />
  </div>
);

const Button = ({ className="", ...p }) => (
  <button
    className={`px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-100 hover:bg-slate-800/70 transition ${className}`}
    {...p}
  />
);

export default function Competences() {
  const [cat, setCat]     = useState("all");
  const [q, setQ]         = useState("");
  const [sort, setSort]   = useState("level"); // level | alpha

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = SKILLS.filter(s => cat==="all" ? true : s.cat===cat);
    if (query) {
      list = list.filter(s =>
        (s.label + " " + s.tags.join(" ")).toLowerCase().includes(query)
      );
    }
    if (sort==="level") list = list.slice().sort((a,b)=>b.level-a.level);
    if (sort==="alpha") list = list.slice().sort((a,b)=>a.label.localeCompare(b.label));
    return list;
  }, [cat, q, sort]);

  const cover = useMemo(() => {
    const avg = filtered.reduce((acc,s)=>acc+s.level, 0) / (filtered.length || 1);
    return Math.min(1, Math.max(0, avg));
  }, [filtered]);

  return (
    <div className="page-glass">
      <header className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-orbitron holo-title">Compétences — Vue Holo</h2>
            <p className="text-sm text-slate-400">Stacks, niveaux, filtres, et tags techno</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={()=>window.print()} title="Imprimer/Exporter PDF">⤓ Export</Button>
            <PageClose />
          </div>
        </div>

        {/* Filtres / recherche */}
        <div className="grid gap-3 mt-4 sm:grid-cols-3">
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button className={cat==="all" ? "holo-chip" : ""} onClick={()=>setCat("all")}>Tout</Button>
            {CATEGORIES.map(c => (
              <Button key={c.key} className={cat===c.key?"holo-chip":""} onClick={()=>setCat(c.key)}>
                {c.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder="Rechercher une compétence/techno…"
              className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-900/70 border-slate-700/60 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
            />
            <select
              value={sort}
              onChange={(e)=>setSort(e.target.value)}
              className="px-2 py-2 text-sm border rounded-xl bg-slate-900/70 border-slate-700/60"
            >
              <option value="level">Trier par niveau</option>
              <option value="alpha">Trier A→Z</option>
            </select>
          </div>
        </div>

        {/* Stat globale (moyenne) */}
        <div className="mt-3 space-y-1 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Indice global (moy. filtrée)</span>
            <span className="text-xs text-slate-200">{Math.round(cover*100)}%</span>
          </div>
          <Gauge value={cover}/>
        </div>
      </header>

      {/* Cartes par compétence */}
      <section className="grid gap-4 p-4 pt-0 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(s => {
          const catMeta = CATEGORIES.find(c=>c.key===s.cat) || CATEGORIES[0];
          return (
            <article
              key={s.id}
              className={`p-4 border rounded-2xl border-slate-700/60 bg-gradient-to-b ${catMeta.color} backdrop-blur-md ${catMeta.glow}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Logo */}
                  <div className="grid w-6 h-6 overflow-hidden border rounded-md bg-slate-900/60 border-slate-700/60 place-items-center">
                    {LOGOS[s.id]
                      ? <img src={LOGOS[s.id]} alt={s.label} className="w-5 h-5" loading="lazy" />
                      : <span className="text-xs opacity-70">★</span>}
                  </div>
                  <div>
                    <h3 className="tracking-wide font-orbitron">{s.label}</h3>
                    <p className="text-xs text-slate-400">{catMeta.label}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs border rounded-md border-slate-700/60 bg-slate-900/60">
                  {Math.round(s.level*100)}%
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-1 text-xs">
                  {s.tags.map(t => <Pill key={t}>{t}</Pill>)}
                </div>
                <Gauge value={s.level}/>
              </div>
            </article>
          );
        })}
        {filtered.length===0 && (
          <div className="p-6 text-sm text-slate-400 opacity-80">Aucune compétence pour ce filtre.</div>
        )}
      </section>
    </div>
  );
}
