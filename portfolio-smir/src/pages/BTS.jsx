// src/pages/BTS.jsx
import React, { useMemo, useState, useMemo as _useMemo } from "react";
import PageClose from "@/scenes/ui/PageClose.jsx";

/* =========================
   Données démo (inchangé)
   ========================= */
const demo = {
  projets: [
    { id:"p1", titre:"Portail RH", epreuves:["E4","E5"], competences:["C1.1","C2.2","C3.1"], techno:["Laravel","MySQL","Docker"], niveau:.82 },
    { id:"p2", titre:"API Logistique", epreuves:["E4"],     competences:["C2.1","C3.2"],       techno:["Node","MongoDB"],       niveau:.68 },
    { id:"p3", titre:"Portfolio Spatial", epreuves:["E5"],  competences:["C1.2","C2.2","C4.1"], techno:["React","R3F","Three"],  niveau:.91 },
  ],
  competences: [
    { id:"C1.1", label:"Analyser un besoin" }, { id:"C1.2", label:"Concevoir archi" },
    { id:"C2.1", label:"Dév back/API" },      { id:"C2.2", label:"Dév front/IHM" },
    { id:"C3.1", label:"Déployer/Conteneuriser" }, { id:"C3.2", label:"CI/CD & tests" },
    { id:"C4.1", label:"Support & doc" },
  ],
};

/* =========================
   Mini UI lib (holo)
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
    {/* bordure animée subtile */}
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
   Badges techno avec icônes SVG inline
   ========================= */
const icons = {
  Node: (
    <svg viewBox="0 0 128 128" className="w-3.5 h-3.5">
      <path fill="#83CD29" d="M64 .6L5.8 34.1v59.2L64 126.6l58.2-33.3V34.1z"/>
      <path fill="#111827" d="M64 15.2l44.8 25.7v46.2L64 112.8 19.2 87V41z"/>
      <path fill="#83CD29" d="M83.8 52.4c0-10.8-6.3-17.1-18.3-17.1H45.7v54.9h11.4V73.2h6.9l10 17h12.9L75 71.5c5.9-2.5 8.8-8.1 8.8-19.1zm-18.4 9.2h-8.4V46.5h8.6c5.8 0 9 2.3 9 7.6 0 5.7-3.2 7.5-9.2 7.5z"/>
    </svg>
  ),
  MongoDB: (
    <svg viewBox="0 0 128 128" className="w-3.5 h-3.5">
      <path fill="#10B981" d="M64 8s-3.3 60.2-30 77.6C50.7 92.3 57.9 112 64 120c6.1-8 13.3-27.7 30-34.4C67.3 68.2 64 8 64 8z"/>
      <path fill="#064E3B" d="M64 120c-4.3-5.8-8.6-14.7-12-24 4.6-3.5 8.2-8.5 12-16 3.8 7.5 7.4 12.5 12 16-3.4 9.3-7.7 18.2-12 24z"/>
    </svg>
  ),
  Laravel: (
    <svg viewBox="0 0 128 128" className="w-3.5 h-3.5">
      <path fill="#FF2D20" d="M92 12l24 14v28L68 86 44 72V44l24-14L92 12zM20 32l24 14v28L20 60V32z"/>
    </svg>
  ),
  MySQL: (
    <svg viewBox="0 0 128 128" className="w-3.5 h-3.5">
      <path fill="#2563EB" d="M20 96c16-28 44-48 72-52 8 0 12 4 16 10-18 2-36 12-48 26 12 2 22 4 32 10-16 12-36 18-56 16-8-2-14-6-16-10z"/>
      <circle cx="100" cy="48" r="6" fill="#1E3A8A" />
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 128 128" className="w-3.5 h-3.5">
      <rect x="8" y="60" width="112" height="28" rx="6" fill="#38BDF8"/>
      <rect x="28" y="44" width="16" height="12" fill="#0EA5E9"/>
      <rect x="46" y="44" width="16" height="12" fill="#0EA5E9"/>
      <rect x="64" y="44" width="16" height="12" fill="#0EA5E9"/>
    </svg>
  ),
  React: (
    <svg viewBox="0 0 128 128" className="w-3.5 h-3.5">
      <circle cx="64" cy="64" r="10" fill="#67E8F9"/>
      <g fill="none" stroke="#22D3EE" strokeWidth="6">
        <ellipse cx="64" cy="64" rx="50" ry="20"/>
        <ellipse cx="64" cy="64" rx="50" ry="20" transform="rotate(60 64 64)"/>
        <ellipse cx="64" cy="64" rx="50" ry="20" transform="rotate(120 64 64)"/>
      </g>
    </svg>
  ),
  R3F: (
    <svg viewBox="0 0 128 128" className="w-3.5 h-3.5">
      <path d="M64 16l48 28v40L64 112 16 84V44z" fill="#7DD3FC"/>
      <path d="M64 32l32 18v28L64 96 32 78V50z" fill="#0EA5E9"/>
    </svg>
  ),
  Three: (
    <svg viewBox="0 0 128 128" className="w-3.5 h-3.5">
      <path fill="#60A5FA" d="M20 96l44-76 44 76H20z"/>
      <path fill="#1D4ED8" d="M64 88l26-44 26 44H64z"/>
    </svg>
  ),
};

const TechPill = ({ name }) => (
  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs border-cyan-400/30 bg-cyan-400/10 text-cyan-100">
    <span className="shrink-0">{icons[name] ?? <span className="w-3.5 h-3.5 rounded bg-cyan-300/40" />}</span>
    {name}
  </span>
);

/* =========================
   Gauges (HUD)
   ========================= */
const Gauge = ({ value = 0.7 }) => {
  const pct = Math.round(value * 100);
  return (
    <div className="w-full h-2 overflow-hidden border rounded-full border-cyan-400/30 bg-slate-900/60">
      <div
        className="relative h-full bg-gradient-to-r from-cyan-400/80 to-sky-400/80"
        style={{ width: `${pct}%`, boxShadow: "0 0 20px rgba(56,189,248,.45)" }}
      >
        <div className="absolute inset-0 opacity-60 bg-[linear-gradient(90deg,transparent_0,rgba(255,255,255,.35)_50%,transparent_100%)] animate-[scan_1.8s_linear_infinite]" />
      </div>
      {/* scan anim */}
      <style>{`@keyframes scan{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
};

/* =========================
   Page BTS
   ========================= */
export default function BTS() {
  const [epreuve, setEpreuve] = useState("E4");
  const [query, setQuery]     = useState("");
  const [view, setView]       = useState("projets"); // projets | matrice | refs
  const [pdfUrl, setPdfUrl]   = useState("");

  const referentiels = [
    {
      label: "Référentiel BTS SIO (MEN – ENQDiP, PDF)",
      url: "https://enqdip.sup.adc.education.fr/bts/referentiel/BTS_ServicesInformatiquesOrganisations.pdf",
      source: "MEN / ENQDiP",
    },
    {
      label: "Référentiel de compétences – Annexe I.B (PDF)",
      url: "https://www.btsinfo.nc/wp-content/uploads/2022/09/BTS_ServicesInformatiquesOrganisations2019_Referentiel_competences.pdf",
      source: "Annexe I.B",
    },
    {
      label: "Page CERTA (rénovation 2019, 1ère session 2022)",
      url: "https://www.reseaucerta.org/sio2019/accueil",
      source: "Réseau CERTA",
    },
    {
      label: "Arrêté du 8 juillet 2024 (modifications)",
      url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049926463",
      source: "Légifrance",
    },
  ];

  const projetsFiltres = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demo.projets
      .filter((p) => p.epreuves.includes(epreuve))
      .filter((p) =>
        q ? [p.titre, ...p.techno, ...p.competences].join(" ").toLowerCase().includes(q) : true
      );
  }, [epreuve, query]);

  const couverture = useMemo(() => {
    const set = new Set(
      demo.projets.filter(p => p.epreuves.includes(epreuve)).flatMap(p => p.competences)
    );
    return Math.min(1, set.size / demo.competences.length);
  }, [epreuve]);

  return (
    <div className="page-glass">
      {/* ===== Header ===== */}
      <header className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <h2 className="text-2xl tracking-widest font-orbitron holo-title">
              BTS SIO — Session 2026
            </h2>
            <p className="text-sm text-slate-400">
              E4/E5 ↔ Projets ↔ Compétences • Interface holo
            </p>
            {/* micro neon */}
            <span className="absolute -left-2 -top-2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,.9)]" />
          </div>
          <div className="flex items-center gap-2">
            {["E4","E5"].map(e => (
              <Button key={e} onClick={()=>setEpreuve(e)} glow={e===epreuve}>
                {e}
              </Button>
            ))}
            <Button onClick={()=>window.print()} title="Imprimer/Exporter PDF">⤓ Export</Button>
            <PageClose />
          </div>
        </div>

        <HoloDivider className="my-3" />

        {/* recherche + stats */}
        <div className="grid gap-3 mt-2 sm:grid-cols-3">
          <div className="space-y-1 sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Couverture compétences</span>
              <span className="text-xs text-cyan-200">{Math.round(couverture*100)}%</span>
            </div>
            <Gauge value={couverture}/>
          </div>
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Rechercher projet / techno / compétence…"
            className="w-full px-3 py-2 text-sm border rounded-xl bg-slate-900/70 border-cyan-400/20 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          />
        </div>

        {/* switch de vues */}
        <div className="flex items-center gap-2 mt-3">
          {[
            {k:"projets", label:"Projets"},
            {k:"matrice", label:"Matrice"},
            {k:"refs",    label:"Référentiels officiels"},
          ].map(v=>(
            <Button key={v.k} onClick={()=>setView(v.k)} glow={view===v.k}>
              {v.label}
            </Button>
          ))}
        </div>
      </header>

      {/* ===== Vue Projets ===== */}
      {view==="projets" && (
        <section className="grid gap-4 p-4 pt-0 md:grid-cols-2">
          {projetsFiltres.map(p=>(
            <HoloCard key={p.id}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="tracking-wide font-orbitron">{p.titre}</h3>
                    <p className="text-xs text-slate-400">{p.epreuves.join(" • ")}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.techno.map(t => <TechPill key={t} name={t} />)}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-1 text-xs">
                    {p.competences.map(c=>(
                      <span key={c} className="px-2 py-0.5 rounded-md border border-cyan-400/30 text-cyan-200/90 bg-cyan-400/10">
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Niveau</span>
                      <span className="text-xs text-slate-300">{Math.round(p.niveau*100)}%</span>
                    </div>
                    <Gauge value={p.niveau}/>
                  </div>
                </div>
              </div>
            </HoloCard>
          ))}
          {projetsFiltres.length===0 && (
            <div className="p-6 text-sm text-slate-400 opacity-80">Aucun projet pour ce filtre.</div>
          )}
        </section>
      )}

      {/* ===== Vue Matrice ===== */}
      {view==="matrice" && (
        <section className="p-4 pt-0">
          <HoloCard>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-900/60 text-slate-300 font-orbitron">
                  <tr>
                    <th className="p-3 text-left border-b border-cyan-400/20">Compétence</th>
                    {demo.projets.filter(p=>p.epreuves.includes(epreuve)).map(p=>(
                      <th key={p.id} className="p-3 text-left border-b border-cyan-400/20">{p.titre}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {demo.competences.map(c=>{
                    const projs = demo.projets.filter(p=>p.epreuves.includes(epreuve));
                    return (
                      <tr key={c.id} className="odd:bg-slate-900/20">
                        <td className="p-3 border-b border-slate-800/50 whitespace-nowrap">
                          <span className="font-medium">{c.id}</span>{" "}
                          <span className="text-slate-400">{c.label}</span>
                        </td>
                        {projs.map(p=>{
                          const yes = p.competences.includes(c.id);
                          return (
                            <td key={p.id+c.id} className="p-3 border-b border-slate-800/50">
                              {yes ? (
                                <span className="px-2 py-0.5 rounded-md bg-cyan-400/15 border border-cyan-400/30 text-cyan-200/90 text-xs">
                                  Couvert
                                </span>
                              ) : (
                                <span className="text-xs text-slate-600">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </HoloCard>
        </section>
      )}

      {/* ===== Vue Référentiels ===== */}
      {view==="refs" && (
        <section className="p-4 pt-0 space-y-3">
          <HoloCard>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {referentiels.map((r)=>(
                  <Button
                    key={r.url}
                    className="holo-chip"
                    glow
                    onClick={()=>setPdfUrl(r.url)}
                    title={`Ouvrir : ${r.source}`}
                  >
                    {r.label}
                  </Button>
                ))}
              </div>

              {pdfUrl ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Button onClick={()=>window.open(pdfUrl, "_blank")}>Ouvrir dans un onglet</Button>
                    <a
                      href={pdfUrl}
                      download
                      className="px-3 py-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-100"
                    >
                      ⤓ Télécharger le PDF
                    </a>
                  </div>
                  <div className="overflow-hidden border rounded-xl border-cyan-400/20 bg-slate-950/50" style={{height: "70vh"}}>
                    <object data={pdfUrl} type="application/pdf" width="100%" height="100%">
                      <iframe title="PDF viewer fallback" src={pdfUrl} width="100%" height="100%" />
                    </object>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-400">
                  Sélectionne un référentiel pour l’afficher ici.
                </p>
              )}
            </div>
          </HoloCard>

          <p className="text-xs text-slate-500">
            Référentiel officiel (MEN/ENQDiP) et sources CERTA/Légifrance. La rénovation 2019 est la base en vigueur (1ʳᵉ session 2022) et reste valable pour la session 2026, avec mises à jour réglementaires (arrêté du 8 juillet 2024).
          </p>
        </section>
      )}
    </div>
  );
}
