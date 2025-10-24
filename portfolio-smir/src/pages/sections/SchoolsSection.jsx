// src/pages/sections/SchoolsSection.jsx
import React from "react";

/* ===== nombre d’or & thème ===== */
const PHI = 1.618;
const INV = 1 / PHI;
const INV2 = INV * INV;

const THEME = {
  bg: "#0a0f1c",
  card: "rgba(10,16,30,0.78)",
  border: "rgba(255,215,0,0.12)",
  text: "#E6ECF8",
  sub: "#9AA7BF",
  brandFrom: "#22d3ee",
  brandTo: "#a855f7",
  line:
    "linear-gradient(90deg, rgba(56,189,248,.0) 0%, rgba(56,189,248,.45) 24%, rgba(212,175,55,.85) 50%, rgba(147,51,234,.55) 76%, rgba(56,189,248,.0) 100%)",
};

/* ===== données ===== */
const SCHOOLS = [
  {
    id: "ifcv-ndrc",
    school: "IFCV",
    program: "BTS NDRC (Négociation et Digitalisation de la Relation Client)",
    link: "https://www.ifcv.fr/",
    period: "Alternance",
    rhythm: "1 semaine entreprise / 1 semaine cours",
    focus: [
      "Prospection & négociation",
      "Social selling & CRM",
      "Parcours client omnicanal",
      "E-commerce & outils digitaux",
    ],
    color: "#22d3ee",
  },
  {
    id: "cfa-stephenson-softec",
    school: "CFA Stephenson",
    program: "Titre professionnel SOFTEC",
    link: "https://www.cfastephenson.fr/",
    period: "Alternance",
    rhythm: "1 semaine entreprise / 1 semaine cours",
    focus: [
      "Gestion opérationnelle",
      "Tech & support utilisateur",
      "Organisation de projet",
      "Qualité & méthodologie",
    ],
    color: "#f59e0b",
  },
  {
    id: "dsp-ief2i-sio",
    school: "Digital School of Paris – IEF2I",
    program: "BTS SIO (Services Informatiques aux Organisations)",
    link: "https://www.ief2i.fr/",
    period: "Alternance",
    rhythm: "1 semaine entreprise / 1 semaine cours",
    focus: [
      "Dév. applicatif (option SLAM)",
      "Bases de données & SQL",
      "Réseaux / Systèmes (SI)",
      "Sécurité & bonnes pratiques",
    ],
    color: "#a855f7",
  },
];

/* ===== primitives UI ===== */
function Panel({ title, subtitle, right, children, bodyClass = "" }) {
  return (
    <section
      className="relative rounded-[1.0rem] border shadow-xl backdrop-blur-xl overflow-hidden"
      style={{ borderColor: THEME.border, background: THEME.card }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(140% 100% at 0% 0%, transparent 0%, black 50%, black 100%)",
          background: `conic-gradient(from 0deg, ${THEME.brandFrom}, ${THEME.brandTo}, ${THEME.brandFrom})`,
          opacity: 0.06,
          animation: "spin-slow 18s linear infinite",
        }}
      />
      <header
        className="relative flex items-center justify-between border-b border-white/10"
        style={{ padding: `${0.618 * PHI}rem ${1.0 * PHI}rem` }}
      >
        <div>
          <h3
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
              fontSize: `${1.0 * PHI}rem`,
              lineHeight: 1.0 + INV2,
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="mt-[0.382rem] text-sm" style={{ color: THEME.sub }}>
              {subtitle}
            </p>
          )}
        </div>
        {right}
      </header>
      <div className={`relative p-4 ${bodyClass}`}>{children}</div>
      <div className="h-[0.236rem] w-full" style={{ background: THEME.line }} />
    </section>
  );
}

function Badge({ children }) {
  return (
    <span className="px-2 py-1 text-[0.78rem] rounded-full border border-white/10 bg-white/5">
      {children}
    </span>
  );
}

function SchoolCard({ s }) {
  return (
    <a
      href={s.link}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-[1rem] border border-white/10 bg-slate-900/55 hover:bg-slate-900/70 transition overflow-hidden"
      style={{ boxShadow: "0 0.618rem 1.618rem rgba(0,0,0,.35)" }}
    >
      {/* bandeau couleur */}
      <div
        className="h-[0.3rem] w-full"
        style={{ background: `linear-gradient(90deg, ${s.color}, transparent 80%)` }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4
              className="font-bold leading-tight"
              style={{ color: THEME.text, fontSize: "1.05rem" }}
            >
              {s.school}
            </h4>
            <p className="text-sm" style={{ color: THEME.sub }}>
              {s.program}
            </p>
          </div>
          <span
            className="px-2 py-1 text-[0.75rem] rounded-md border"
            style={{
              borderColor: "rgba(255,255,255,.12)",
              background: "rgba(255,255,255,.04)",
              color: THEME.text,
            }}
            title="Rythme de formation"
          >
            {s.period}
          </span>
        </div>

        <div className="mt-[0.618rem] text-xs text-slate-300">
          <div className="mb-1 font-semibold">Rythme :</div>
          <div>{s.rhythm}</div>
        </div>

        <ul className="mt-[0.618rem] grid grid-cols-1 gap-[0.382rem] text-sm text-slate-300">
          {s.focus.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-[0.2rem] text-cyan-300">•</span>
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-[0.618rem] flex flex-wrap items-center gap-[0.382rem]">
          <Badge>Alternance</Badge>
          <Badge>Lien officiel ↗</Badge>
        </div>
      </div>
    </a>
  );
}

/* ===== objectif M2 Big Data & IA ===== */
function GoalCard() {
  return (
    <Panel
      title="Objectif parcours — M2 Big Data & IA"
      subtitle="Consolider le socle dev / data / cloud et viser un master orienté ML, data engineering & MLOps"
      right={<Badge>Prochain cap</Badge>}
    >
      <div className="grid grid-cols-1 gap-[0.618rem] md:grid-cols-2">
        <div className="rounded-md border border-white/10 bg-white/5 p-[0.618rem]">
          <div className="text-sm font-semibold text-slate-100">Compétences cibles</div>
          <ul className="mt-[0.382rem] space-y-[0.236rem] text-sm text-slate-300">
            <li>• Python data (NumPy, Pandas, PyTorch/TF, scikit-learn)</li>
            <li>• SQL avancé, modélisation, optimisation requêtes</li>
            <li>• Data eng. (ETL, Airflow, Spark, dbt)</li>
            <li>• Cloud & MLOps (Docker, Git, CI, déploiement)</li>
            <li>• Notions IA générative & RAG</li>
          </ul>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-[0.618rem]">
          <div className="text-sm font-semibold text-slate-100">Pistes & infos utiles</div>
          <ul className="mt-[0.382rem] space-y-[0.236rem] text-sm text-slate-300">
            <li>• Mastères Big Data/IA (écoles d’ingé, écoles du numérique)</li>
            <li>• Alternance possible en M1/M2 (data analyst/engineer junior)</li>
            <li>• Projets concrets : pipelines, dashboards, modèles ML</li>
            <li>• Certifs utiles : Azure DP-203, AWS Data Engineering, Databricks</li>
          </ul>
        </div>
      </div>
    </Panel>
  );
}

/* ===== section ===== */
export default function SchoolsSection() {
  return (
    <section
      id="ecole"
      className="min-h-[100svh] snap-center text-slate-100"
      style={{
        background:
        "radial-gradient(60% 60% at 30% 20%, rgba(212,175,55,.05), transparent 62%), radial-gradient(40% 40% at 80% 70%, rgba(147,51,234,.04), transparent 62%), rgba(8,12,24,0.25)",
        backdropFilter: "blur(2px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: `${(INV * PHI) * PHI}rem ${1.0 * PHI}rem`,
      }}
    >
      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
      `}</style>

      <div className="w-full mx-auto" style={{ maxWidth: `${56 * PHI}rem` }}>
        {/* header centré */}
        <div className="mb-[1.0rem] text-center">
          <h2
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
              fontSize: `clamp(1.8rem, ${1.618 * PHI}rem, 3rem)`,
              lineHeight: 1.0 + INV,
            }}
          >
            Parcours scolaire & formations
          </h2>
          <p className="mx-auto mt-[0.382rem] max-w-3xl text-[0.95rem]" style={{ color: THEME.sub }}>
            Alternance continue — <strong>1 semaine entreprise</strong> / <strong>1 semaine cours</strong>.  
            Focus commercial, opérationnel et technique jusqu’au <strong>BTS SIO</strong>, puis projection **M2 Big Data & IA**.
          </p>
        </div>

        {/* cards écoles */}
        <div className="grid grid-cols-1 gap-[1.0rem] md:grid-cols-2 lg:grid-cols-3">
          {SCHOOLS.map((s) => (
            <SchoolCard key={s.id} s={s} />
          ))}
        </div>

        {/* objectif M2 */}
        <div className="mt-[1.0rem]">
          <GoalCard />
        </div>

        {/* infos utiles */}
        <div className="mt-[1.0rem] text-center text-[0.9rem]" style={{ color: THEME.sub }}>
          Besoin d’attestations, bulletins, ou référentiels de compétences ? Je peux les fournir sur demande.
        </div>
      </div>
    </section>
  );
}
