// src/pages/sections/UserStorySection.jsx
import React, { useEffect, useRef } from "react";

/* ============================
   Nombre d’or & Thème
   ============================ */
const PHI = 1.618;
const INV = 1 / PHI;     // 0.618
const INV2 = INV * INV;  // 0.382

const THEME = {
  bg: "#08101e",
  card: "rgba(12,18,36,0.78)",
  border: "rgba(255,215,0,0.12)",
  text: "#E6ECF8",
  sub: "#9AA7BF",
  brandFrom: "#22d3ee",  // cyan
  brandTo: "#a855f7",    // violet
  line:
    "linear-gradient(90deg, rgba(56,189,248,.0) 0%, rgba(56,189,248,.45) 24%, rgba(212,175,55,.85) 50%, rgba(147,51,234,.55) 76%, rgba(56,189,248,.0) 100%)",
};

/* ============================
   Primitives
   ============================ */
function Panel({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-[1.0rem] border backdrop-blur-xl shadow-xl overflow-hidden ${className}`}
      style={{ borderColor: THEME.border, background: THEME.card, boxShadow: "0 0.618rem 1.618rem rgba(0,0,0,.35)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: "radial-gradient(140% 100% at 0% 0%, transparent 0%, black 50%, black 100%)",
          background: `conic-gradient(from 0deg, ${THEME.brandFrom}, ${THEME.brandTo}, ${THEME.brandFrom})`,
          opacity: 0.06,
          animation: "spin-slow 24s linear infinite",
        }}
      />
      {children}
      <div className="h-[0.236rem] w-full" style={{ background: THEME.line }} />
    </div>
  );
}

/* Révélation douce au scroll */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) el.classList.add("reveal-in");
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ============================
   Section principale
   ============================ */
export default function UserStorySection() {
  const refHero = useReveal();
  const refIntro = useReveal();
  const refTimeline = useReveal();
  const refValues = useReveal();
  const refContacts = useReveal();

  return (
    <section
      id="user-story"
      className="min-h-[100svh] snap-center text-slate-100 relative overflow-hidden"
      style={{
        background:
        "radial-gradient(60% 60% at 30% 15%, rgba(212,175,55,.05), transparent 62%)," +
        "radial-gradient(40% 40% at 80% 85%, rgba(147,51,234,.04), transparent 62%), rgba(8,12,24,0.25)",
        backdropFilter: "blur(2px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: `${(INV * PHI) * PHI}rem ${1.0 * PHI}rem`,
      }}
    >
      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes floaty { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
        /* particules */
        .particles:before, .particles:after {
          content:""; position:absolute; inset:-20%; pointer-events:none;
          background:
            radial-gradient(3px 3px at 20% 30%, rgba(255,255,255,.12) 40%, transparent 41%),
            radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,.10) 40%, transparent 41%),
            radial-gradient(2.5px 2.5px at 80% 20%, rgba(255,255,255,.08) 40%, transparent 41%),
            radial-gradient(2px 2px at 35% 85%, rgba(255,255,255,.08) 40%, transparent 41%);
          animation: floaty 7s ease-in-out infinite;
        }
        .particles:after { animation-delay: 1.6s; filter: blur(0.5px); opacity:.7 }
        /* reveal */
        .reveal { opacity:0; transform: translateY(10px) scale(0.995); transition: opacity .6s ease, transform .6s ease }
        .reveal.reveal-in { opacity:1; transform: translateY(0) scale(1) }
        /* flip card */
        .flip { transform-style: preserve-3d; transition: transform .6s }
        .flip:hover { transform: rotateY(180deg) }
        .flip-face { backface-visibility: hidden }
        .flip-back { transform: rotateY(180deg) }
      `}</style>

      {/* ======= HERO ======= */}
      <div ref={refHero} className="relative max-w-6xl mx-auto reveal particles">
        <div className="text-center mb-[1.0rem]">
          <h2
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
              fontSize: `clamp(1.9rem, ${1.618 * PHI}rem, 3.2rem)`,
              lineHeight: 1.0 + INV,
            }}
          >
            De la <span className="text-cyan-300">Banque</span> à l’<span className="text-violet-300">Ingénierie Logicielle</span>
          </h2>
          <p className="mx-auto mt-[0.382rem] max-w-3xl text-[0.95rem]" style={{ color: THEME.sub }}>
            Un parcours pas tout droit — mais volontaire : relation client, rigueur & pilotage côté banque, puis virage plein sud vers
            le code, la sécurité et l’entrepreneuriat produit.
          </p>
        </div>

        {/* bande visuelle : photo + pitch */}
        <div className="grid grid-cols-1 gap-[1.0rem] md:grid-cols-[minmax(0,0.618fr)_minmax(0,1fr)]">
          {/* photo card */}
          <Panel>
            <div className="p-4">
              <div
                className="relative overflow-hidden border rounded-xl border-white/10"
                style={{ aspectRatio: `${PHI} / 1`, background: "linear-gradient(180deg,#0b142b,#0c1225)" }}
              >
                {/* Remplace l’URL par ta photo (ou <img src={...} />). Ici : placeholder gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_10%_0%,#1f325a_0%,#0c1428_40%,transparent_50%)]" />
                <div className="absolute inset-0 flex items-center justify-center text-slate-300/70">
                  <span className="text-sm">Ta photo ici</span>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 text-[0.78rem] rounded-md bg-black/45 border border-white/10">
                  Sagar — Builder • Dev • Ops
                </div>
              </div>
              <p className="mt-[0.618rem] text-sm" style={{ color: THEME.sub }}>
                Curieux, orienté impact. J’aime transformer des idées en systèmes robustes, mesurables et beaux à utiliser.
              </p>
            </div>
          </Panel>

          {/* pitch story */}
          <Panel>
            <div className="p-5">
              <h3 className="text-lg font-bold">Chapitre I → III : l’épopée</h3>
              <div className="mt-[0.618rem] space-y-[0.382rem] text-[0.98rem] leading-relaxed">
                <p>
                  <strong>I. Banque</strong> — école de la précision : conformité, rigueur opérationnelle, écoute client.
                  J’y apprends à cadrer, prioriser, livrer.
                </p>
                <p>
                  <strong>II. Dev</strong> — la mécanique des idées. D’abord le web, puis la sécurité, la donnée. JS/TS, React, Node,
                  SQL, Linux — l’outillage devient un langage.
                </p>
                <p>
                  <strong>III. Entrepreneuriat</strong> — <em>H2O</em>, avec deux marques déposées :
                  <span className="text-cyan-300"> ALAFRENCH</span> (textile) et
                  <span className="text-violet-300"> ALAFRENCHCARE</span> (cosmétique). Produit, e-commerce, DA, go-to-market.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* ======= TIMELINE (flip cards) ======= */}
      <div ref={refTimeline} className="reveal max-w-6xl mx-auto mt-[1.0rem]">
        <h3
          className="mb-[0.618rem] font-extrabold tracking-tight"
          style={{ fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif" }}
        >
          Timeline condensée
        </h3>
        <div className="grid grid-cols-1 gap-[0.8rem] md:grid-cols-3">
          {/* Banque */}
          <div className="rounded-[1rem] border border-white/15 bg-white/5 overflow-hidden">
            <div className="relative flip" style={{ aspectRatio: `${PHI} / 1` }}>
              <div className="absolute inset-0 p-4 flip-face">
                <div className="h-full p-4 border rounded-lg bg-gradient-to-br from-cyan-400/10 to-transparent border-white/10">
                  <div className="text-sm opacity-75">Chapitre I</div>
                  <div className="mt-1 text-lg font-bold">Banque</div>
                  <ul className="mt-2 text-sm text-slate-300 space-y-1.5">
                    <li>• Précision & conformité</li>
                    <li>• Relation client & priorisation</li>
                    <li>• Rigueur opérationnelle</li>
                  </ul>
                </div>
              </div>
              <div className="absolute inset-0 p-4 flip-back flip-face">
                <div className="h-full p-4 border rounded-lg bg-slate-900/70 border-white/10">
                  <div className="text-sm opacity-75">Compétences</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    <li>• Process & contrôle</li>
                    <li>• Communication claire</li>
                    <li>• Gestion des risques</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Dev */}
          <div className="rounded-[1rem] border border-white/15 bg-white/5 overflow-hidden">
            <div className="relative flip" style={{ aspectRatio: `${PHI} / 1` }}>
              <div className="absolute inset-0 p-4 flip-face">
                <div className="h-full p-4 border rounded-lg bg-gradient-to-br from-sky-400/10 to-transparent border-white/10">
                  <div className="text-sm opacity-75">Chapitre II</div>
                  <div className="mt-1 text-lg font-bold">Développement</div>
                  <ul className="mt-2 text-sm text-slate-300 space-y-1.5">
                    <li>• React/Next • Node/Express</li>
                    <li>• SQL • Linux • Git</li>
                    <li>• Sécurité & perf</li>
                  </ul>
                </div>
              </div>
              <div className="absolute inset-0 p-4 flip-back flip-face">
                <div className="h-full p-4 border rounded-lg bg-slate-900/70 border-white/10">
                  <div className="text-sm opacity-75">Livrables</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    <li>• Intranet MDP ↔ AS400</li>
                    <li>• CRUD, recherche, auth</li>
                    <li>• Portfolio 3D, e-commerce</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* H2O */}
          <div className="rounded-[1rem] border border-white/15 bg-white/5 overflow-hidden">
            <div className="relative flip" style={{ aspectRatio: `${PHI} / 1` }}>
              <div className="absolute inset-0 p-4 flip-face">
                <div className="h-full p-4 border rounded-lg bg-gradient-to-br from-violet-400/10 to-transparent border-white/10">
                  <div className="text-sm opacity-75">Chapitre III</div>
                  <div className="mt-1 text-lg font-bold">H2O — Marques</div>
                  <ul className="mt-2 text-sm text-slate-300 space-y-1.5">
                    <li>• ALAFRENCH (textile)</li>
                    <li>• ALAFRENCHCARE (cosmétique)</li>
                    <li>• DTC, DA, automatisations</li>
                  </ul>
                </div>
              </div>
              <div className="absolute inset-0 p-4 flip-back flip-face">
                <div className="h-full p-4 border rounded-lg bg-slate-900/70 border-white/10">
                  <div className="text-sm opacity-75">Axes</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    <li>• Go-to-market mesuré</li>
                    <li>• Qualité / conformité</li>
                    <li>• Créativité utile</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======= VALEURS & SKILLS ======= */}
      <div ref={refValues} className="reveal max-w-6xl mx-auto mt-[1.0rem]">
        <Panel>
          <div className="p-5 grid grid-cols-1 gap-[0.8rem] md:grid-cols-2">
            <div>
              <h4 className="text-lg font-bold">Valeurs</h4>
              <ul className="mt-[0.382rem] space-y-[0.3rem] text-[0.98rem] text-slate-300">
                <li>• Sobriété & lisibilité — un produit utile avant tout.</li>
                <li>• Robustesse — log, tests, monitoring, sécurité.</li>
                <li>• Progression — apprentissage continu, partage.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold">Skills actuels</h4>
              <div className="mt-[0.382rem] flex flex-wrap gap-[0.382rem]">
                {[
                  "React/Next", "Node/Express", "SQL", "Linux", "Git",
                  "Shopify", "Auth/LDAP", "Webhooks", "SEO basique",
                  "3D WebGL", "CI légère", "Design system",
                ].map((t) => (
                  <span key={t} className="px-2 py-1 text-xs border rounded-full border-white/10 bg-white/5">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* ======= CONTACTS (distinct de la page Contact/Planète) ======= */}
      <div ref={refContacts} className="reveal max-w-6xl mx-auto mt-[1.0rem]">
        <Panel>
          <div className="p-5">
            <h4 className="text-lg font-bold mb-[0.382rem]">Me contacter (accès direct)</h4>
            <p className="text-sm" style={{ color: THEME.sub }}>
              Ici : raccourcis rapides – ta page <em>Contact</em> “planète” reste inchangée.
            </p>

            <div className="mt-[0.618rem] grid gap-[0.618rem] sm:grid-cols-2 lg:grid-cols-4">
              <Chip href={`mailto:H2O.ALAFRENCH@gmail.com`}>H2O.ALAFRENCH@gmail.com</Chip>
              <Chip href={`mailto:jaggyinkgraph@gmail.com`}>jaggyinkgraph@gmail.com</Chip>
              <Chip href={`https://www.linkedin.com/in/mir-sagar/`} external>LinkedIn</Chip>
              <Chip href={`https://github.com/smir75`} external>GitHub</Chip>
              <Chip href={`https://discord.gg/GZ59cJg5vR`} external>Discord</Chip>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}

/* ===== Chip lien ===== */
function Chip({ href, children, external = false }) {
  const base =
    "inline-flex items-center justify-center px-3 py-2 text-sm rounded-xl border border-white/12 bg-white/6 hover:bg-white/10 transition";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={base}>
      ↗ {children}
    </a>
  ) : (
    <a href={href} className={base}>{children}</a>
  );
}
