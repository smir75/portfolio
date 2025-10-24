import React from "react";

const ITEMS = [
  // --- 2025 / 2024–2026 (pairés)
  {
    year: "2025",
    color: "#22d3ee",
    type: "pro",
    title: "Développeur Web — CPMS",
    subtitle: "Alternance • depuis avril 2025",
    bullets: ["Apps internes, intégrations SI, qualité produit"],
    cta: { label: "Voir", href: "https://www.cpms.fr/" },
  },
  {
    year: "2024–2026",
    color: "#60a5fa",
    type: "formation",
    title: "BTS SIO (SLAM) — Institut F2I",
    subtitle: "Digital School of Paris • Groupe IEF2I",
    bullets: ["Dev, bases de données, qualité logicielle"],
    cta: { label: "Institut F2I", href: "https://www.institut-f2i.fr" },
  },

  // --- 2023–2024 (pairés)
  {
    year: "2023–2024",
    color: "#a855f7",
    type: "pro",
    title: "Conseiller Clientèle — La Banque Postale",
    subtitle: "Colisée (75008)",
    bullets: ["Digitalisation, support apps, conseil"],
    cta: { label: "LBP", href: "https://www.labanquepostale.fr" },
  },
  {
    year: "2023–2024",
    color: "#34d399",
    type: "formation",
    title: "Titre SOFTEC",
    subtitle: "Stephenson • COCLI (Formaposte)",
    bullets: ["Relation client, conformité, culture bancaire"],
    cta: { label: "Stephenson", href: "https://www.stephenson-formation.com" },
  },

  // --- 2021–2023 (pairés)
  {
    year: "2021–2023",
    color: "#ef4444",
    type: "pro",
    title: "Chargé de Clientèle — La Banque Postale",
    subtitle: "Colisée (75008)",
    bullets: ["Parcours clients à distance, assistance plateformes"],
    cta: { label: "LBP", href: "https://www.labanquepostale.fr" },
  },
  {
    year: "2021–2023",
    color: "#f97316",
    type: "formation",
    title: "BTS NDRC — IFCV",
    subtitle: "Levallois-Perret",
    bullets: ["Négociation, relation client digitale"],
    cta: { label: "IFCV", href: "https://www.ifcv.fr" },
  },

  // --- solos
  {
    year: "2024",
    color: "#2563eb",
    type: "pro",
    title: "Fondateur — ALAFRENCH CARE",
    subtitle: "H2O (SAS) • alafrenchcare.com",
    bullets: ["E-commerce Shopify, automatisations, data/catalogue"],
    cta: { label: "Visiter", href: "https://alafrenchcare.com" },
  },
  {
    year: "2019–2021",
    color: "#eab308",
    type: "pro",
    title: "Réceptionniste — Maison Albar Le Vendôme 5★",
    subtitle: "Hospitality de luxe",
    bullets: ["Accueil, service haut de gamme, gestion imprévus"],
    cta: { label: "Hôtel", href: "https://www.maison-albar-hotels.com" },
  },
  {
    year: "2017–2019",
    color: "#14b8a6",
    type: "pro",
    title: "Technicien Fibre Optique (D3) — Ekkocity",
    subtitle: "FTTH • Déploiement & maintenance",
    bullets: ["Installations, config réseau, diagnostics"],
  },
  {
    year: "2017",
    color: "#94a3b8",
    type: "formation",
    title: "Bac STMG (Marketing) — Lycée Maurice Utrillo",
    subtitle: "Seine-Saint-Denis",
    bullets: ["Management, marketing, éco-droit"],
    cta: {
      label: "Établissement",
      href: "https://www.google.com/search?q=Lyc%C3%A9e+Maurice+Utrillo",
    },
  },
];

// -------- util: accès par titre
const byTitle = (t) => ITEMS.find((i) => i.title === t) || null;

// -------- rows: chaque ligne = gauche (PRO) / droite (FORMATION)
const ROWS = [
  { // 1
    left: byTitle("Développeur Web — CPMS"),
    right: byTitle("BTS SIO (SLAM) — Institut F2I"),
    
  },
  { // 2
    left: byTitle("Fondateur — ALAFRENCH CARE"),
    right: null,
  },
  { // 3
    left: byTitle("Conseiller Clientèle — La Banque Postale"),
    right: byTitle("Titre SOFTEC"),
    
  },
  { // 4
    left: byTitle("Chargé de Clientèle — La Banque Postale"),
    right: byTitle("BTS NDRC — IFCV"),
  },
  { // 5
    left: byTitle("Réceptionniste — Maison Albar Le Vendôme 5★"),
    right: null,
  },
  { // 6
    left: byTitle("Technicien Fibre Optique (D3) — Ekkocity"),
    right: null,
  },
  { // 7
    left: null,
    right: byTitle("Bac STMG (Marketing) — Lycée Maurice Utrillo"),
  },
];

// -------- carte
function Card({ item, isPro }) {
  if (!item) return null;
  return (
    <div
      className="relative max-w-[420px] w-full rounded-xl bg-white/95 backdrop-blur text-slate-900 border-2 shadow-xl p-3 transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl"
      style={{ borderColor: item.color }}
    >
      <div
        className={`absolute -top-3 ${isPro ? "left-4" : "right-4"} px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-full shadow-md`}
        style={{ background: isPro ? "#ef4444" : "#3b82f6" }}
      >
        {isPro ? "💼 Pro" : "🎓 Formation"}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block px-3 py-1 text-xs font-extrabold text-white rounded-md"
          style={{ background: item.color }}
        >
          {item.year}
        </span>
      </div>

      <h4 className="text-base font-extrabold leading-tight text-slate-800">
        {item.title}
      </h4>
      {item.subtitle && (
        <p className="mt-1 text-xs font-medium text-slate-600">{item.subtitle}</p>
      )}
      {item.bullets?.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          {item.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-lg leading-none" style={{ color: item.color }}>
                •
              </span>
              <span className="flex-1">{b}</span>
            </li>
          ))}
        </ul>
      )}
      {item.cta && (
        <div className="mt-3">
          <a
            href={item.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all hover:gap-2"
            style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)` }}
          >
            {item.cta.label}
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default function ParcoursSection() {
  return (
    <section
      id="parcours"
      className="min-h-[100svh] text-slate-100 flex items-center snap-center bg-[rgba(8,12,24,0.35)] backdrop-blur-[2px] border-t border-white/5"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* titre */}
        <div className="mb-8 text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight md:text-4xl"
            style={{ fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif" }}
          >
            Mon Parcours
          </h2>
          <div className="mx-auto mt-3 w-32 h-1 rounded-full bg-gradient-to-r from-[#60a5fa] via-[#d4af37] to-[#a41d28]" />
          <p className="max-w-2xl mx-auto mt-4 text-sm text-slate-400">
            De la relation client au développement : un parcours guidé par l&apos;exigence et le sens du service
          </p>
        </div>

        {/* légende */}
        <div className="flex justify-center gap-6 mb-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-slate-300">À gauche : Expérience professionnelle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-slate-300">À droite : Formation</span>
          </div>
        </div>

        {/* timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* ligne centrale */}
          <div className="absolute top-0 w-1 h-full -translate-x-1/2 left-1/2 bg-gradient-to-b from-cyan-400 via-yellow-400 to-slate-600 opacity-30" />

          {/* lignes alignées */}
          <div className="space-y-4 md:space-y-5">
            {ROWS.map((row, idx) => {
              // couleur du point central = priorité au côté gauche sinon droite
              const dotColor = (row.left?.color || row.right?.color || "#64748b");
              return (
                <div key={idx} className="relative flex items-stretch">
                  {/* pastille centrale */}
                  <div className="absolute z-10 -translate-x-1/2 left-1/2 top-1/2 -mt-2.5">
                    <div
                      className={`w-5 h-5 rounded-full border-4 ${idx === 0 ? "animate-pulse" : ""}`}
                      style={{
                        borderColor: dotColor,
                        background: "#0a0f1c",
                        boxShadow: `0 0 16px ${dotColor}40`,
                      }}
                    />
                  </div>
                  

                  {/* trait vers gauche */}
                  {row.left && (
                    <div
                      className="absolute top-1/2 right-1/2 mr-2.5 w-8 h-0.5"
                      style={{
                        backgroundImage: `linear-gradient(to left, ${row.left.color}80, transparent)`,
                      }}
                    />
                  )}

                  {/* trait vers droite */}
                  {row.right && (
                    <div
                      className="absolute top-1/2 left-1/2 ml-2.5 w-8 h-0.5"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${row.right.color}80, transparent)`,
                      }}
                    />
                  )}

                  {/* colonne gauche (PRO) */}
                  <div className="flex justify-end w-1/2 pr-6">
                    <Card item={row.left} isPro />
                  </div>

                  {/* espace colonne droite */}
                  <div className="w-1/2 pl-6">
                    <Card item={row.right} isPro={false} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* footer */}
        <div className="mt-10 text-center">
          <p className="text-xs italic text-slate-500">
            Du terrain au code, une progression continue vers l&apos;excellence technique
          </p>
        </div>
      </div>
    </section>
  );
}
