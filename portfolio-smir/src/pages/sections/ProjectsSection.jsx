// src/pages/sections/ProjectsSection.jsx
import React, { useState, useMemo, useCallback } from "react";

/* ============================
   Constantes “nombre d’or”
   ============================ */
const PHI = 1.618;           // φ
const INV = 1 / PHI;         // ≈ 0.618
const INV2 = INV * INV;      // ≈ 0.382

/* ============================
   Données projets (tes valeurs)
   ============================ */
const PROJECTS = [
  {
    id: "cpms",
    title: "Intranet CPMS",
    date: "2025",
    description: "Module changement de mot de passe WAD ↔ AS400",
    detail:
      "Flux sécurisé du poste client vers l'AS400. Authentification, logging, retries et monitoring. Intégration AD/LDAP.",
    category: "entreprise",
    color: "#22d3ee",
    docUrl: "#",
  },
  {
    id: "alafrenchcare",
    title: "alafrenchcare.com",
    date: "2024",
    description: "E-commerce CBD cosmétiques",
    detail:
      "Shopify + automatisations (webhooks, catalogue). Packaging et mise en ligne complète. Gestion commandes.",
    category: "autodidacte",
    color: "#f59e0b",
    docUrl: "https://alafrenchcare.com",
  },
  {
    id: "alafrenchfr",
    title: "alafrench.fr",
    date: "2024",
    description: "Site vitrine & marque personnelle",
    detail:
      "Portfolio et blog professionnel. SEO optimisé, formulaires de contact, design responsive moderne.",
    category: "autodidacte",
    color: "#a855f7",
    docUrl: "https://alafrench.fr",
  },
  {
    id: "portfolio",
    title: "Portfolio 3D",
    date: "2024",
    description: "React + Three.js interactif",
    detail:
      "Expérience 3D immersive. Optimisation WebGL, scènes modulaires, animations fluides et shaders personnalisés.",
    category: "entreprise",
    color: "#10b981",
    docUrl: "#",
  },
  {
    id: "flipper",
    title: "Flipper Zero",
    date: "2023–2024",
    description: "Dev & pentest hardware",
    detail:
      "Scripts personnalisés, émulations RFID/NFC, tests matériels. Analyse de protocoles sans fil et pentest.",
    category: "autodidacte",
    color: "#ef4444",
    docUrl: "#",
  },
  {
    id: "dev_annonce",
    title: "Annonz",
    date: "2024",
    description: "Plateforme type LeBonCoin",
    detail:
      "Site d'annonces complet : CRUD, recherche full-text, upload images, auth utilisateur et modération.",
    category: "scolaire",
    color: "#3b82f6",
    docUrl: "#",
  },
  {
    id: "tp_sql",
    title: "TP Injection SQL",
    date: "2024",
    description: "Sécurité & vulnérabilités",
    detail:
      "Découverte SQLi, démonstration d'exploitation et mitigation. Prepared statements, ORM et bonnes pratiques.",
    category: "scolaire",
    color: "#8b5cf6",
    docUrl: "#",
  },
  {
    id: "linux_installs",
    title: "Installations Linux",
    date: "2023–2024",
    description: "Kali / Ubuntu / Lubuntu",
    detail:
      "Automatisation ISO, partitionnement, config réseau. Optimisation VM et bare-metal, scripts de déploiement.",
    category: "scolaire",
    color: "#14b8a6",
    docUrl: "#",
  },
  {
    id: "bootable_keys",
    title: "Clés bootables",
    date: "2023",
    description: "Dépannage & outils de secours",
    detail:
      "Création de clés USB bootables pour restauration système. Environnements de récupération Windows/Linux.",
    category: "scolaire",
    color: "#eab308",
    docUrl: "#",
  },
  {
    id: "win_server",
    title: "Windows Server 2022",
    date: "2023",
    description: "Gestion de parc informatique",
    detail:
      "Active Directory, GPO, déploiement d'images. Gestion centralisée des updates, monitoring et sécurité.",
    category: "scolaire",
    color: "#06b6d4",
    docUrl: "#",
  },
  {
    id: "virtual_vm",
    title: "VirtualBox & VMware",
    date: "2023",
    description: "Virtualisation multi-OS",
    detail:
      "Gestion VMs et snapshots. Configuration réseau (bridged/NAT), optimisation disque et système de backup.",
    category: "scolaire",
    color: "#6366f1",
    docUrl: "#",
  },
];

/* ============================
   Badges catégories
   ============================ */
const CATEGORY_META = {
  all: { label: "Tous", color: "#64748b" },
  scolaire: { label: "Scolaire", color: "#3b82f6" },
  entreprise: { label: "Entreprise", color: "#10b981" },
  autodidacte: { label: "Autodidacte", color: "#f59e0b" },
};

/* ============================
   Carte projet (flip + a11y)
   ============================ */
function ProjectCard({ p }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggle = useCallback(() => setIsFlipped((v) => !v), []);
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  return (
    <div className="w-full">
      <div
        className="relative h-[12.5rem] cursor-pointer select-none"
        style={{
          perspective: `${62 * INV}rem`, // ≈ 38rem
        }}
        onClick={toggle}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`${p.title} — ${isFlipped ? "détails" : "aperçu"}`}
      >
        <div
          className={`relative w-full h-full transition-transform duration-[${Math.round(
            380 * PHI
          )}ms] [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Face avant */}
          <div
            className="absolute inset-0 rounded-[1.0rem] p-[0.9rem] border shadow-lg border-white/10 bg-slate-900/90 backdrop-blur-sm"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              boxShadow:
                "0 0.618rem 1.618rem rgba(0,0,0,.35), inset 0 0 0 0.062rem rgba(212,175,55,.08)",
            }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-[0.5rem]">
                <span
                  className="px-[0.618rem] py-[0.382rem] text-[0.7rem] font-bold text-white rounded-full"
                  style={{ backgroundColor: CATEGORY_META[p.category].color }}
                >
                  {CATEGORY_META[p.category].label}
                </span>
                <span className="text-[0.75rem] font-medium text-slate-400">
                  {p.date}
                </span>
              </div>

              <h3
                className="mb-[0.382rem] font-extrabold leading-tight"
                style={{
                  color: p.color,
                  fontSize: `${1.0 * PHI}rem`, // ≈ 1.618rem
                  lineHeight: 1.0 + INV2,
                  fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
                }}
                title={p.title}
              >
                {p.title}
              </h3>

              <p className="flex-1 text-[0.925rem] leading-relaxed text-slate-300">
                {p.description}
              </p>

              <div className="pt-[0.618rem] mt-auto border-t border-white/10">
                <p className="text-[0.7rem] italic text-center text-slate-500">
                  Cliquer / Entrée pour détails →
                </p>
              </div>
            </div>
          </div>

          {/* Face arrière */}
          <div
            className="absolute inset-0 rounded-[1.0rem] p-[0.9rem] border shadow-lg bg-slate-800/95 backdrop-blur-sm [transform:rotateY(180deg)]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderColor: p.color,
            }}
          >
            <div className="flex flex-col h-full">
              <h4
                className="mb-[0.6rem] font-bold"
                style={{ color: p.color, fontSize: `${1.0}rem` }}
              >
                Détails
              </h4>

              <p className="flex-1 overflow-y-auto text-[0.85rem] leading-relaxed text-slate-300">
                {p.detail}
              </p>

              <div className="pt-[0.618rem] mt-[0.618rem] border-t border-white/10">
                <a
                  href={p.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="block w-full py-[0.6rem] text-[0.8rem] font-bold text-center text-white transition-transform rounded-lg hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-white/40"
                  style={{ backgroundColor: p.color }}
                >
                  📄 Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================
   Section
   ============================ */
export default function ProjectsSection() {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section
      id="projets"
      className="flex flex-col justify-center min-h-screen px-4 py-12 snap-center text-slate-100 bg-[rgba(8,12,24,0.3)] backdrop-blur-[2px] border-t border-white/5"
      style={{
        ["--phi"]: PHI,
        background:
        "radial-gradient(60% 60% at 30% 20%, rgba(212,175,55,.08), transparent 62%), radial-gradient(40% 40% at 80% 70%, rgba(164,29,40,.06), transparent 62%)",
      }}
    >
      <div
        className="w-full mx-auto"
        style={{
          maxWidth: `${56 * PHI}rem`,
          padding: `${(INV * PHI) * PHI}rem ${1.0 * PHI}rem`, // ≈ 1.0*φ² vertical, φ horizontal
        }}
      >
        {/* Header */}
        <div className="mb-[1.0rem] text-center">
          <h2
            className="mb-[0.6rem] font-extrabold tracking-tight"
            style={{
              fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
              color: "#e2e8f0",
              fontSize: `${1.618 * PHI}rem`, // ≈ 2.618rem
              lineHeight: 1.0 + INV, // ≈ 1.618
            }}
          >
            Projets
          </h2>
          <div className="mx-auto w-[6.18rem] h-[0.236rem] rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400" />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center justify-center gap-[0.5rem] mb-[1.0rem]">
          {Object.entries(CATEGORY_META).map(([k, meta]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-[1.0rem] py-[0.6rem] rounded-full font-bold text-white text-[0.8rem] transition-all focus:outline-none ${
                filter === k
                  ? "scale-105 ring-2 ring-white/30 shadow-lg"
                  : "opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: meta.color }}
              aria-pressed={filter === k}
            >
              {meta.label}
            </button>
          ))}
        </div>

        {/* Grille compacte (4 → 3 → 2 → 1) */}
        <div className="grid gap-[0.9rem] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-[1.0rem] text-center">
          <p className="text-[0.75rem] italic text-slate-500">
            {filtered.length} projet{filtered.length > 1 ? "s" : ""} • Cliquez ou pressez Entrée pour
            retourner la carte
          </p>
        </div>
      </div>
    </section>
  );
}
