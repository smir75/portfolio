import React, { useState, useMemo } from "react";

function Icon({ name, className = "inline-block w-5 h-5 mr-2 align-middle" }) {
  switch (name) {
    case "react":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2v20M2 12h20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "node":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12v6l9 4 9-4v-6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "linux":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
        </svg>
      );
    case "virtualbox":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="1.5" />
        </svg>
      );
    case "vmware":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 7h16v10H4z" strokeWidth="1.5" />
        </svg>
      );
    case "sql":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "windows":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 6l8-2v8l-8 2V6zM13 4l8-2v8l-8 2V4z" strokeWidth="1.2" />
        </svg>
      );
    case "kali":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 3c4 0 7 3 9 6-2 3-5 6-9 6s-7-3-9-6c2-3 5-6 9-6z" strokeWidth="1.2" />
        </svg>
      );
    case "git":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12l6-6 12 12-6 6z" strokeWidth="1.2" />
        </svg>
      );
    default:
      return <span className={className} />;
  }
}

/* ------------------------------
   Projects data (MOST RECENT FIRST)
   Primary category: "entreprise" | "scolaire" | "autodidacte"
   ------------------------------ */
const PROJECTS = [
  {
    id: "cpms",
    title: "Intranet CPMS — changement de mot de passe WAD ↔ AS400",
    short: "Module d’entreprise pour gérer les changements de mdp depuis le poste client jusqu’à l’AS400.",
    detail:
      "Conception et dev d’un flux sécurisé : poste client → intranet → WAD → AS400. Authent, logging, retries et monitoring. Intégration AD/LDAP.",
    tools: ["node", "react", "git"],
    category: "entreprise",
  },
  {
    id: "alafrenchcare",
    title: "alafrenchcare.com",
    short: "Boutique e-commerce (auto-entreprise) — CBD cosmétiques.",
    detail:
      "Shopify + automatisations (catalogue, webhooks, import/export produits). Packaging et mise en ligne du catalogue.",
    tools: ["react", "git"],
    category: "autodidacte",
  },
  {
    id: "alafrenchfr",
    title: "alafrench.fr",
    short: "Site vitrine & marque personnelle.",
    detail: "Site promo et blog, SEO basique, contact et formulaires.",
    tools: ["react", "git"],
    category: "autodidacte",
  },
  {
    id: "portfolio",
    title: "Portfolio personnel (Sagario)",
    short: "Portfolio web 3D — React + Three.js (travail scolaire/pro).",
    detail: "Project 3D interactif, optimisation WebGL, scènes modulaires, rigs caméra et shaders légers.",
    tools: ["react"],
    category: "entreprise", // classé pro / école — ici pro
  },
  {
    id: "flipper",
    title: "Flipper Zero — dev & pentest",
    short: "Dév et expérimentations (radio, scripts, pentest hardware).",
    detail: "Dev de scripts, émulations RFID, tests matériels et intégration dans routines pentest.",
    tools: ["linux", "git"],
    category: "autodidacte",
  },
  {
    id: "dev_annonce",
    title: "Projet Annonz (mini-LeBonCoin)",
    short: "Site d’annonces : CRUD, recherche, messages, filtres.",
    detail:
      "Livrable scolaire : plateforme d’annonces avec upload d’images, recherche full-text, user auth et modération.",
    tools: ["node", "react", "sql"],
    category: "scolaire",
  },
  {
    id: "tp_sql",
    title: "TP Injection SQL",
    short: "Exercice d’enseignement sur vulnérabilités SQLi.",
    detail:
      "TP de découverte des injections SQL, démonstration d’exploitation (paramétrage non-préparé) et mitigation (prepared statements, ORM).",
    tools: ["sql", "windows"],
    category: "scolaire",
  },
  {
    id: "linux_installs",
    title: "Installation Linux — Kali / Ubuntu / Lubuntu",
    short: "Installations multi-OS et post-install (drivers, partitionnement).",
    detail: "Automatisation des ISO, partitions, configuration réseau et optimisation VM / bare-metal.",
    tools: ["linux", "virtualbox"],
    category: "scolaire",
  },
  {
    id: "bootable_keys",
    title: "Clés bootables & bypass accessibilité",
    short: "Création de clés bootables pour dépannage / bypass d’accès (cours).",
    detail: "Réalisation d’outils de secours sur clé USB pour restauration et diagnostics (Windows/Linux).",
    tools: ["windows", "linux"],
    category: "scolaire",
  },
  {
    id: "win_server",
    title: "Windows Server 2022 — gestion de parc",
    short: "Mise en place d’un serveur central pour gestion de parc (scolarité).",
    detail: "AD, GPO, déploiement d’images, gestion updates et monitoring basique.",
    tools: ["windows"],
    category: "scolaire",
  },
  {
    id: "virtual_vm",
    title: "VirtualBox & VMware — multi-OS",
    short: "Install sur Win11 / mac / Linux — gestion VMs et snapshots.",
    detail: "Compatibilité hôte/guest, bridged/NAT, optimisation disque et backup des VM.",
    tools: ["virtualbox", "vmware"],
    category: "scolaire",
  },
];

/* ------------------------------
   Colors for category badges
   ------------------------------ */
const CATEGORY_META = {
  all: { label: "Tous", color: "bg-slate-600" },
  scolaire: { label: "Scolaire", color: "bg-blue-600" },
  entreprise: { label: "Entreprise", color: "bg-green-600" },
  autodidacte: { label: "Autodidacte", color: "bg-amber-600" },
};

/* ------------------------------
   Card component (flip)
   - keep size restrained
   ------------------------------ */
function ProjectCard({ p }) {
  return (
    <div className="w-full p-2 sm:w-1/2 lg:w-1/3">
      <div className="relative perspective-1000">
        {/* container taille fixe pour uniformité */}
        <div className="w-full h-44 md:h-48 lg:h-44">
          <input id={`flip-${p.id}`} type="checkbox" className="hidden peer" />
          <label
            htmlFor={`flip-${p.id}`}
            className="block w-full h-full cursor-pointer"
            aria-hidden="false"
            title="Clique pour retourner"
          >
            <div
              className="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d peer-checked:rotate-y-180"
              style={{ WebkitTransformStyle: "preserve-3d", transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 p-4 overflow-hidden border rounded-lg shadow-md backface-hidden border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/70"
                style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold leading-tight text-white md:text-base">{p.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full text-white ${CATEGORY_META[p.category].color}`}
                    aria-hidden="true"
                  >
                    {CATEGORY_META[p.category].label}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-300 line-clamp-3">{p.short}</p>

                <div className="absolute flex items-center justify-between bottom-3 left-4 right-4">
                  <div className="flex items-center text-xs text-slate-300">
                    {p.tools.slice(0, 4).map((t) => (
                      <span key={t} className="flex items-center mr-2">
                        <Icon name={t} />
                        <span className="sr-only">{t}</span>
                      </span>
                    ))}
                  </div>
                  <div className="text-xs italic text-slate-400">Clique pour +</div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 p-4 overflow-auto border rounded-lg shadow-lg rotate-y-180 backface-hidden border-slate-700 bg-slate-900/95"
                style={{
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold leading-tight text-white md:text-base">Détails</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full text-white ${CATEGORY_META[p.category].color}`}
                    aria-hidden="true"
                  >
                    {CATEGORY_META[p.category].label}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-300">{p.detail}</p>

                <div className="absolute flex items-center justify-between bottom-3 left-4 right-4">
                  <div className="text-xs text-slate-400">
                    Outils: {p.tools.map((t) => t).join(" • ")}
                  </div>
                  <label
                    htmlFor={`flip-${p.id}`}
                    className="text-xs underline cursor-pointer text-amber-400"
                    aria-hidden="true"
                  >
                    Fermer
                  </label>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <style jsx>{`
       
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .peer-checked\\:rotate-y-180:checked ~ .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
      `}</style>
    </div>
  );
}

/* ------------------------------
   Main section
   ------------------------------ */
export default function ProjectsSection() {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section  id="projets"  className="snap-center min-h-screen flex flex-col justify-center py-12 px-4 bg-[#050712] text-slate100" >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold md:text-3xl">Projets</h2>
            <p className="text-sm text-slate-400">Chronologie (récent → ancien). Clique sur une carte pour tourner.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            {Object.entries(CATEGORY_META).map(([k, meta]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition ${filter === k ? "scale-105 ring-2 ring-white/20" : "opacity-80"} ${meta.color}`}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid: cards wrap to next line */}
        <div className="flex flex-wrap -m-2">
          {filtered.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-6 text-xs italic text-slate-500"> La liste est encore en construction.</div>
      </div>
    </section>
  );
}
