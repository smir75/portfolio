import React, { useMemo, useState } from "react";
import { Zap, Cpu, Shield, BookOpen, Rocket, Grid3X3, FileText } from "lucide-react";

const demo = {
  projets: [
    { id:"p1", titre:"Portail RH", epreuves:["E4","E5"], competences:["C1.1","C2.2","C3.1"], techno:["Laravel","MySQL","Docker"], niveau:.82 },
    { id:"p2", titre:"API Logistique", epreuves:["E4"], competences:["C2.1","C3.2"], techno:["Node","MongoDB"], niveau:.68 },
    { id:"p3", titre:"Portfolio Spatial", epreuves:["E5"], competences:["C1.2","C2.2","C4.1"], techno:["React","R3F","Three"], niveau:.91 },
  ],
  competences: [
    { id:"C1.1", label:"Analyser un besoin" }, { id:"C1.2", label:"Concevoir archi" },
    { id:"C2.1", label:"Dév back/API" }, { id:"C2.2", label:"Dév front/IHM" },
    { id:"C3.1", label:"Déployer/Conteneuriser" }, { id:"C3.2", label:"CI/CD & tests" },
    { id:"C4.1", label:"Support & doc" },
  ],
};

const icons = {
  Node: <Cpu className="w-3.5 h-3.5" />,
  MongoDB: <Zap className="w-3.5 h-3.5" />,
  Laravel: <Rocket className="w-3.5 h-3.5" />,
  MySQL: <Grid3X3 className="w-3.5 h-3.5" />,
  Docker: <Shield className="w-3.5 h-3.5" />,
  React: <Zap className="w-3.5 h-3.5" />,
  R3F: <Rocket className="w-3.5 h-3.5" />,
  Three: <Rocket className="w-3.5 h-3.5" />,
};



const GradientBorder = ({ children, color = "from-cyan-500" }) => (
  <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${color} to-blue-500 p-0.5`}>
    <div className="relative p-6 bg-slate-950 rounded-2xl">{children}</div>
  </div>
);

const ModuleHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text">
      {title}
    </h2>
  </div>
);

const TechPill = ({ name }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-violet-400/50 bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-200 text-xs font-medium hover:border-violet-300 transition">
    {icons[name] || <span className="w-3.5 h-3.5 rounded bg-violet-300/40" />}
    {name}
  </span>
);

const SkillBadge = ({ id, label }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-400/50 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-200 text-xs font-medium">
    <span className="font-bold text-cyan-300">{id}</span>
    {label}
  </span>
);

const Gauge = ({ value = 0.7, color = "from-cyan-400 to-blue-400" }) => {
  const pct = Math.round(value * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">Progression</span>
        <span className="font-bold text-cyan-300">{pct}%</span>
      </div>
      <div className="w-full h-3 overflow-hidden border rounded-full bg-slate-800/50 border-slate-700">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 shadow-lg`}
          style={{ width: `${pct}%`, boxShadow: `0 0 15px rgba(34,211,238,.6)` }}
        />
      </div>
    </div>
  );
};

export default function BTS() {
  const [epreuve, setEpreuve] = useState("E4");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("projets");

  const projetsFiltres = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demo.projets
      .filter((p) => p.epreuves.includes(epreuve))
      .filter((p) => q ? [p.titre, ...p.techno, ...p.competences].join(" ").toLowerCase().includes(q) : true);
  }, [epreuve, query]);

  const couverture = useMemo(() => {
    const set = new Set(demo.projets.filter(p => p.epreuves.includes(epreuve)).flatMap(p => p.competences));
    return Math.min(1, set.size / demo.competences.length);
  }, [epreuve]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Fond étoilé */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20%_30%,#fff_0%,rgba(255,255,255,0.1)_50%),radial-gradient(2px_2px_at_60%_70%,#aef_0%,rgba(174,225,255,0.1)_50%),radial-gradient(1px_1px_at_50%_50%,#fff_0%,rgba(255,255,255,0.08)_50%)]" style={{ backgroundSize: "200% 200%, 300% 300%, 250% 250%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      </div>

      <div className="relative z-10 p-6 mx-auto max-w-7xl">
        {/* Header spectaculaire */}
        <div className="mb-8 text-center">
          <div className="inline-block px-6 py-2 mb-4 text-sm font-bold tracking-widest border rounded-full border-cyan-500/50 bg-cyan-500/10 text-cyan-300">
            ⊕ SESSION 2026
          </div>
          <h1 className="mb-2 text-5xl font-black text-transparent md:text-6xl bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text">
            BTS SIO
          </h1>
          <p className="text-lg text-slate-400">Services Informatiques aux Organisations</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["E4", "E5"].map(e => (
              <button
                key={e}
                onClick={() => setEpreuve(e)}
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
                  e === epreuve
                    ? `bg-gradient-to-r ${e === "E4" ? "from-cyan-500 to-blue-500" : "from-purple-500 to-pink-500"} text-white shadow-lg scale-105`
                    : "border border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation modulaire */}
        <div className="grid grid-cols-2 gap-3 mb-8 md:grid-cols-5">
          {[
            { k: "projets", label: "Projets", icon: Rocket, color: "from-cyan-500 to-blue-500" },
            { k: "matrice", label: "Matrice", icon: Grid3X3, color: "from-purple-500 to-pink-500" },
            { k: "exams", label: "Épreuves", icon: FileText, color: "from-orange-500 to-red-500" },
            { k: "blocs", label: "Blocs", icon: Shield, color: "from-green-500 to-emerald-500" },
            { k: "refs", label: "Références", icon: BookOpen, color: "from-indigo-500 to-blue-500" },
          ].map(v => {
            const Icon = v.icon;
            return (
              <button
                key={v.k}
                onClick={() => setView(v.k)}
                className={`relative group p-3 rounded-xl transition-all duration-300 ${
                  view === v.k
                    ? `bg-gradient-to-r ${v.color} text-white shadow-lg scale-105`
                    : "bg-slate-900/50 border border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-bold">{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stats globales */}
        <GradientBorder color="from-cyan-500">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="mb-2 text-sm text-slate-400">Couverture compétences</p>
              <Gauge value={couverture} color="from-cyan-400 to-blue-400" />
            </div>
            <div>
              <p className="mb-2 text-sm text-slate-400">Projets filtrés</p>
              <div className="text-3xl font-black text-cyan-300">{projetsFiltres.length}/{demo.projets.length}</div>
            </div>
            <div>
              <p className="mb-2 text-sm text-slate-400">Recherche</p>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Projet, techno, compétence…"
                className="w-full px-4 py-2 border rounded-lg bg-slate-900 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </GradientBorder>

        {/* Vue Projets */}
        {view === "projets" && (
          <div className="mt-8 space-y-6">
            <ModuleHeader icon={Rocket} title="Projets Pédagogiques" color="bg-gradient-to-br from-cyan-500 to-blue-500" />
            <div className="grid gap-6 md:grid-cols-2">
              {projetsFiltres.map(p => (
                <GradientBorder key={p.id} color="from-blue-500">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-cyan-100">{p.titre}</h3>
                      <p className="text-sm text-slate-400">{p.epreuves.join(" • ")}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.techno.map(t => <TechPill key={t} name={t} />)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.competences.map(c => <SkillBadge key={c} id={c} label={demo.competences.find(x => x.id === c)?.label} />)}
                    </div>
                    <Gauge value={p.niveau} color="from-blue-400 to-cyan-400" />
                  </div>
                </GradientBorder>
              ))}
            </div>
          </div>
        )}

        {/* Vue Matrice */}
        {view === "matrice" && (
          <div className="mt-8">
            <ModuleHeader icon={Grid3X3} title="Matrice de Couverture" color="bg-gradient-to-br from-purple-500 to-pink-500" />
            <GradientBorder color="from-purple-500">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-4 py-3 font-bold text-left text-purple-300">Compétence</th>
                      {demo.projets.filter(p => p.epreuves.includes(epreuve)).map(p => (
                        <th key={p.id} className="px-4 py-3 font-bold text-left text-purple-300">{p.titre}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {demo.competences.map((c, i) => {
                      const projs = demo.projets.filter(p => p.epreuves.includes(epreuve));
                      return (
                        <tr key={c.id} className={i % 2 === 0 ? "bg-purple-500/5" : ""}>
                          <td className="px-4 py-3 border-b border-slate-800">
                            <span className="font-bold text-purple-300">{c.id}</span>
                            <span className="text-xs text-slate-400"> {c.label}</span>
                          </td>
                          {projs.map(p => (
                            <td key={p.id + c.id} className="px-4 py-3 border-b border-slate-800">
                              {p.competences.includes(c.id) ? (
                                <span className="inline-block px-2 py-1 text-xs font-bold text-purple-200 rounded-md bg-purple-500/30">✓</span>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GradientBorder>
          </div>
        )}

        {/* Vue Épreuves */}
        {view === "exams" && (
          <div className="mt-8 space-y-6">
            <ModuleHeader icon={FileText} title="Calendrier Épreuves 2026" color="bg-gradient-to-br from-orange-500 to-red-500" />
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { title: "Culture économique", date: "18 mai", time: "14:00 - 18:00", badge: "4h" },
                { title: "Mathématiques", date: "18 mai", time: "16:00 - 18:00", badge: "2h" },
                { title: "LVE A", date: "19 mai", time: "10:30 - 12:30", badge: "2h" },
                { title: "Culture générale", date: "19 mai", time: "14:30 - 17:30", badge: "3h" },
              ].map((exam, i) => (
                <GradientBorder key={i} color="from-orange-500">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-orange-100">{exam.title}</h3>
                      <span className="px-2 py-1 text-xs font-bold text-orange-300 rounded-lg bg-orange-500/20">{exam.badge}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-300">📅 {exam.date}</p>
                      <p className="text-sm text-slate-400">🕐 {exam.time}</p>
                    </div>
                  </div>
                </GradientBorder>
              ))}
            </div>
          </div>
        )}

        {/* Vue Blocs */}
        {view === "blocs" && (
          <div className="mt-8 space-y-6">
            <ModuleHeader icon={Shield} title="Blocs de Compétences" color="bg-gradient-to-br from-green-500 to-emerald-500" />
            <div className="space-y-4">
              {[
                { title: "Support & Services", color: "from-green-500 to-emerald-500", skills: ["Patrimoine informatique", "Help desk", "Déploiement", "E-réputation"] },
                { title: "Développement Apps", color: "from-blue-500 to-cyan-500", skills: ["Conception", "Développement", "Maintenance", "Gestion données"] },
                { title: "Cybersécurité", color: "from-red-500 to-pink-500", skills: ["Protection données", "Sécurité équipements", "Garantir données", "Sécurité app"] },
              ].map((bloc, i) => (
                <GradientBorder key={i} color={bloc.color}>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white bg-gradient-to-r">{bloc.title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {bloc.skills.map((skill, j) => (
                        <div key={j} className="px-3 py-2 text-sm border rounded-lg bg-white/5 border-white/10 text-slate-200">
                          ✦ {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </GradientBorder>
              ))}
            </div>
          </div>
        )}

        {/* Vue Références */}
        {view === "refs" && (
          <div className="mt-8 space-y-6">
            <ModuleHeader icon={BookOpen} title="Référentiels Officiels" color="bg-gradient-to-br from-indigo-500 to-blue-500" />
            <GradientBorder color="from-indigo-500">
              <div className="space-y-3">
                <a href="https://www.education.gouv.fr/sites/default/files/ensecsup629_v2.pdf" target="_blank" rel="noreferrer" className="block p-4 font-semibold text-indigo-100 transition border rounded-lg bg-indigo-500/20 border-indigo-400/50 hover:border-indigo-300">
                  📄 BO — Calendrier BTS 2026
                </a>
                <a href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049926463" target="_blank" rel="noreferrer" className="block p-4 font-semibold text-indigo-100 transition border rounded-lg bg-indigo-500/20 border-indigo-400/50 hover:border-indigo-300">
                  ⚖️ Légifrance — Arrêté BTS SIO
                </a>
              </div>
            </GradientBorder>
          </div>
        )}
      </div>
    </div>
  );
}