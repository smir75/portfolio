// src/pages/Parcours.jsx
import React, { useMemo } from "react";
import PageClose from "@/scenes/ui/PageClose.jsx";

/** 
 * Données condensées depuis ton CV (expé + formation + extras).
 * Source : Cv Jag fullstack.pdf. 
 * (Mise à jour dans le code si ton CV change) 
 */
const DATA = {
  experiences: [
    {
      title: "Fondateur — ALAFRENCH CARE",
      org: "alafrenchcare.com",
      period: "2024",
      points: [
        "Site e-commerce (Shopify) & automatisations",
        "Gestion catalogue, bases de données, opérations",
      ],
      badge: "E-commerce",
    },
    {
      title: "Conseiller clientèle — La Banque Postale (Colisée 75008)",
      org: "La Banque Postale",
      period: "10/2023 → 10/2024",
      points: [
        "Accompagnement à la digitalisation des services",
        "Support technique des applis en ligne, analyse des besoins",
      ],
      badge: "Banque / Digital",
    },
    {
      title: "Chargé de clientèle — La Banque Postale",
      org: "La Banque Postale",
      period: "09/2021 → 09/2023",
      points: [
        "Gestion des opérations à distance",
        "Assistance technique plateformes en ligne",
      ],
      badge: "Conseil client",
    },
    {
      title: "Réceptionniste — Maison Albar Le Vendôme 5★",
      org: "Maison Albar Hotels",
      period: "08/2019 → 08/2021",
      points: [
        "Accueil & réservations",
        "Aide à l’adoption des services numériques",
      ],
      badge: "Hôtellerie 5★",
    },
    {
      title: "Technicien fibre optique (FTTH)",
      org: "Ekkocity (D3)",
      period: "2017 → 2019",
      points: [
        "Installation & maintenance réseau",
        "Déploiement / configuration, diagnostic pannes",
      ],
      badge: "Réseaux",
    },
  ],
  education: [
    {
      title: "BTS SIO (SLAM)",
      org: "Institut F2I, Vincennes",
      period: "2024 → 2026",
    },
    { title: "Titre SOFTEC", org: "Stephenson Formation", period: "2023 → 2024" },
    { title: "BTS NDRC", org: "IFCV, Levallois-Perret", period: "2021 → 2023" },
    { title: "Bac Marketing", org: "Lycée Maurice Utrillo", period: "2017" },
  ],
  tech: {
    // stack issue de ton CV (front/back, DB, mobile, outils)
    frontend: ["HTML5", "CSS3", "JavaScript", "React", "Vue"],
    backend: ["Node.js", "PHP (Laravel)", "Python (Django, Flask)"],
    db: ["MySQL", "PostgreSQL", "Firebase"],
    mobile: ["React Native", "Flutter"],
    tools: ["Git/GitHub/GitLab", "API REST", "GraphQL", "Docker", "CI/CD", "WordPress", "Shopify"],
  },
  langs: [
    { label: "Français", level: "C2" },
    { label: "Anglais", level: "C1" },
  ],
  contact: {
    phone: "+33 6 21 87 78 87",
    mail: "s.mir.p293@gmail.com",
    linkedin: "https://www.linkedin.com/in/mir-sagar",
    city: "Villejuif, 94800",
  },
};

// Petit chip “néon”
const Chip = ({ children }) => (
  <span className="px-2 py-1 text-[11px] rounded-md border border-cyan-400/30 text-cyan-200/90 bg-cyan-400/10">
    {children}
  </span>
);

// Carte timeline (expérience/formation)
const Card = ({ title, org, period, points = [], badge }) => (
  <article className="relative p-4 border rounded-2xl border-slate-700/60 bg-gradient-to-b from-slate-900/55 to-slate-950/65 backdrop-blur-md">
    <div className="absolute left-[-14px] top-3 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(56,189,248,0.8)]" />
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="tracking-wide font-orbitron">{title}</h3>
        <p className="text-xs text-slate-400">{org}</p>
      </div>
      <div className="text-[11px] px-2 py-1 rounded-md border border-slate-700/60 bg-slate-900/60 whitespace-nowrap">
        {period}
      </div>
    </div>
    {badge && (
      <div className="mt-2">
        <Chip>{badge}</Chip>
      </div>
    )}
    {points.length > 0 && (
      <ul className="pl-5 mt-3 space-y-1 text-sm list-disc list-outside text-slate-300">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    )}
  </article>
);

export default function Parcours() {
  const { experiences, education, tech, langs, contact } = DATA;

  const groups = useMemo(
    () => [
      { key: "exp", title: "Expériences", items: experiences },
      { key: "edu", title: "Formations", items: education },
    ],
    [experiences, education]
  );

  // URL CV : place ton PDF dans /public/cv.pdf pour un lien stable
  const CV_URL = "public/cv.pdf";

  return (
    <div className="page-glass">
      {/* Header */}
      <header className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-orbitron holo-title">Parcours</h2>
            <p className="text-sm text-slate-400">
              Timeline pro & formations • UI holo • Planète visible en arrière-plan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={CV_URL}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl border border-slate-700/60 bg-slate-900/60 text-slate-100 hover:bg-slate-800/70 transition"
              title="Ouvrir le CV (PDF)"
            >
              ⤓ CV (PDF)
            </a>
            <PageClose />
          </div>
        </div>

        {/* Tech / Langues / Contact en chips */}
        <div className="grid gap-3 mt-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Front-end</p>
            <div className="flex flex-wrap gap-1">
              {tech.frontend.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">Back-end</p>
            <div className="flex flex-wrap gap-1">
              {tech.backend.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-400">Bases de données / Mobile</p>
            <div className="flex flex-wrap gap-1">
              {[...tech.db, ...tech.mobile].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">Outils</p>
            <div className="flex flex-wrap gap-1">
              {tech.tools.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-400">Langues</p>
            <div className="flex flex-wrap gap-1">
              {langs.map((l) => (
                <Chip key={l.label}>
                  {l.label} • {l.level}
                </Chip>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">Contact</p>
            <div className="flex flex-col gap-1 text-sm">
              <a className="underline underline-offset-2 text-slate-200/90" href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
                {contact.phone}
              </a>
              <a className="underline underline-offset-2 text-slate-200/90" href={`mailto:${contact.mail}`}>
                {contact.mail}
              </a>
              <a className="underline underline-offset-2 text-slate-200/90" href={contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <span className="text-slate-400">{contact.city}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <section className="grid gap-6 p-4 pt-0 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.key}>
            <h3 className="mb-2 text-lg font-orbitron text-slate-200">{g.title}</h3>
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400/70 via-cyan-400/20 to-transparent rounded-full" />
              <div className="space-y-4">
                {g.items.map((item, i) => (
                  <Card key={i} {...item} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Note source CV */}
      <footer className="px-4 pb-4 mt-2">
        <p className="text-xs text-slate-500">
          Données issues de ton CV (intitulés, périodes, établissements, langues). Met à jour ce composant si le CV change. 
        </p>
      </footer>
    </div>
  );
}
