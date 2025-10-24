import React from "react";

export default function BTSSection() {
  return (
    <section
    id="bts"
    className="min-h-[100svh] text-slate-100 flex items-center snap-center bg-[rgba(8,12,24,0.35)] backdrop-blur-[2px] border-t border-white/5"

    >
      <div className="container px-6 py-16 mx-auto">
        {/* Titre */}
        <div className="mb-8">
          <h2
            className="text-3xl font-extrabold tracking-tight md:text-4xl"
            style={{ fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif" }}
          >
            BTS SIO
          </h2>
          <div className="mt-2 w-24 h-1 rounded bg-gradient-to-r from-[#60a5fa] via-[#d4af37] to-[#a41d28]" />
        </div>

        {/* Row 1 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Présentation + objectifs */}
          <div className="p-6 border shadow-xl rounded-2xl bg-white/5 backdrop-blur-md border-white/10">
            <p className="text-slate-200/95">
              Le BTS Services Informatiques aux Organisations forme, en deux ans,
              des professionnels capables de concevoir, déployer et maintenir des
              solutions numériques au service des métiers.
            </p>
            <h3 className="mt-5 font-semibold text-slate-100">Objectifs du BTS</h3>
            <ul className="pl-5 mt-3 space-y-2 list-disc text-slate-300/95">
              <li>Acquérir des bases solides en conception et développement d’applications</li>
              <li>Développer une culture informatique professionnelle</li>
              <li>Préparer une insertion rapide en entreprise ou une poursuite d’études</li>
            </ul>
          </div>

          {/* Débouchés pro */}
          <div className="rounded-2xl p-6 shadow-xl border border-white/10 bg-gradient-to-br from-[#1b2a5b] via-[#1a2560] to-[#0f1b3f]">
            <h3 className="font-semibold text-slate-50">Débouchés professionnels</h3>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                "Développeur",
                "Intégrateur web",
                "Chef de projet junior",
                "Consultant IT",
                "Support applicatif",
                "Data / Bases de données",
                "Cybersécurité (montée en compétences)",
                "Technicien systèmes/applicatifs",
              ].map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center justify-center rounded-lg bg-white/10 text-[13px] px-3 py-2"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 : options */}
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          {/* SLAM — option suivie */}
          <div className="relative rounded-2xl bg-white/5 border border-[#60a5fa]/40 shadow-xl p-6">
            <div className="absolute -inset-px rounded-2xl pointer-events-none bg-[radial-gradient(120%_120%_at_0%_0%,#60a5fa22,transparent)]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#60a5fa]/15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h10" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100">SLAM</h4>
                <p className="text-[13px] text-[#60a5fa]">Option suivie</p>
              </div>
            </div>

            <ul className="pl-5 mt-4 space-y-2 list-disc text-slate-300/95">
              <li>Conception et développement d’applications</li>
              <li>Modélisation, bases de données et API</li>
              <li>Applications métiers et intégration SI</li>
              <li>Qualité logicielle et documentation</li>
            </ul>

            <div className="mt-4 rounded-xl bg-white/5 p-3 text-[13px] text-slate-300/90">
              Solutions Logicielles et Applications Métiers : orientation développement
              et architecture applicative avec une forte sensibilité produit.
            </div>
          </div>

          {/* SISR — option alternative */}
          <div className="p-6 border shadow-xl rounded-2xl bg-white/5 border-white/10 opacity-95">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v18M3 12h18" stroke="#9aa4bf" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-100">SISR</h4>
                <p className="text-[13px] text-slate-400">Option alternative</p>
              </div>
            </div>

            <ul className="pl-5 mt-4 space-y-2 list-disc text-slate-300/95">
              <li>Réseaux et infrastructures</li>
              <li>Virtualisation et administration systèmes</li>
              <li>Supervision et sécurité d’exploitation</li>
              <li>Déploiements et services réseau</li>
            </ul>

            <div className="mt-4 rounded-xl bg-white/5 p-3 text-[13px] text-slate-300/90">
              Systèmes et Réseaux : focus infrastructure, administration et services.
            </div>
          </div>
        </div>

        {/* Bandeau résumé perso */}
        <div className="p-5 mt-8 border rounded-2xl border-white/10 bg-white/5 text-slate-300/95">
          En formation à la <strong>Digital School of Paris</strong> (groupe <strong>IEF2I</strong>), option <strong>SLAM</strong>, 
          diplôme prévu en <strong>juin 2026</strong>. Je poursuis cette voie en alternance, avec une approche orientée produit et qualité.
        </div>
      </div>
    </section>
  );
}
