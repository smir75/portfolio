// src/pages/sections/EntrepriseSection.jsx
import React, { useMemo, useState } from "react";

/* ============ Système φ (nombre d’or) ============ */
const PHI = 1.618;
const INV = 1 / PHI;        // 0.618
const INV2 = INV * INV;     // 0.382

/* ============ Thème sobre & pro ============ */
const THEME = {
  bg: "#0b1020",
  card: "rgba(11,16,32,0.78)",
  border: "rgba(255,215,0,0.12)",
  text: "#E6ECF8",
  sub: "#9AA7BF",
  brandFrom: "#22d3ee",  // cyan
  brandTo: "#a855f7",    // violet
  line:
    "linear-gradient(90deg, rgba(56,189,248,.0) 0%, rgba(56,189,248,.45) 24%, rgba(212,175,55,.85) 50%, rgba(147,51,234,.55) 76%, rgba(56,189,248,.0) 100%)",
};

/* ============ Primitives UI ============ */
function Pill({ children }) {
  return (
    <span
      className="px-3 py-[0.38rem] text-[0.82rem] rounded-full border"
      style={{ color: THEME.text, borderColor: "rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)" }}
    >
      {children}
    </span>
  );
}

function Panel({ title, subtitle, right, children, bodyClass = "" }) {
  return (
    <section
      className="relative h-full flex flex-col rounded-[1.0rem] overflow-hidden border shadow-xl backdrop-blur-xl"
      style={{ borderColor: THEME.border, background: THEME.card, boxShadow: "0 0.618rem 1.618rem rgba(0,0,0,.35)" }}
    >
      {/* halo discret animé */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: "radial-gradient(140% 100% at 0% 0%, transparent 0%, black 50%, black 100%)",
          background: `conic-gradient(from 0deg, ${THEME.brandFrom}, ${THEME.brandTo}, ${THEME.brandFrom})`,
          opacity: 0.06,
          animation: "spin-slow 18s linear infinite",
        }}
      />
      <header
        className="relative border-b border-white/10"
        style={{ padding: `${0.618 * PHI}rem ${1.0 * PHI}rem` }}
      >
        <div className="flex items-end justify-between gap-[0.618rem]">
          <div>
            <h3
              className="font-extrabold tracking-tight"
              style={{
                fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
                fontSize: `clamp(1.15rem, ${1.0 * PHI}rem, 1.75rem)`,
                lineHeight: 1.0 + INV2, // ≈1.382
                color: THEME.text,
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="mt-[0.382rem]" style={{ color: THEME.sub, fontSize: `${0.95}rem` }}>
                {subtitle}
              </p>
            )}
          </div>
          {right}
        </div>
      </header>
      <div
        className={`relative flex-1 ${bodyClass}`}
        style={{ padding: `${0.618 * PHI}rem ${1.0 * PHI}rem` }}
      >
        {children}
      </div>
      <div className="h-[0.236rem] w-full" style={{ background: THEME.line }} />
    </section>
  );
}

/* ============ Helpers visuels (screenshots & logos) ============ */
function siteHost(u) {
  try { return new URL(u).hostname; } catch { return u; }
}
function siteScreenshot(u, w = 1200) {
  // Service public WordPress mShots : renvoie une IMAGE (pas d’iframe) → pas de CORS
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(u)}?w=${w}`;
}
function siteLogo(u) {
  const host = siteHost(u);
  return `https://logo.clearbit.com/${host}`;
}
function siteFavicon(u, size = 128) {
  const host = siteHost(u);
  return `https://www.google.com/s2/favicons?sz=${size}&domain=${host}`;
}

/* Fenêtre d’aperçu (avec vrai screenshot + logo). Ratio φ:1 */
function SiteWindow({ title, url, accent = THEME.brandFrom }) {
  const [imgOk, setImgOk] = useState(false);
  const [logoOk, setLogoOk] = useState(false);

  const shot = siteScreenshot(url, 1200);
  const logo = siteLogo(url);
  const favicon = siteFavicon(url, 128);
  const host = siteHost(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-[1rem] overflow-hidden"
      style={{
        boxShadow: "0 0.618rem 1.618rem rgba(0,0,0,.35)",
        background: "transparent",
      }}
      title={title}
    >
      <div
        className="relative"
        style={{
          aspectRatio: `${PHI} / 1`,
          background: `linear-gradient(135deg, ${accent}26, transparent 55%), linear-gradient(180deg,#0b142b,#0c1225)`,
        }}
      >
        {/* screenshot */}
        <img
          src={shot}
          alt={title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${imgOk ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgOk(true)}
          onError={() => setImgOk(false)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* skeleton discret si en chargement */}
        {!imgOk && <div className="absolute inset-0 animate-pulse" style={{ background: "rgba(255,255,255,.04)" }} />}

        {/* overlays lisibilité */}
        <div className="absolute inset-x-0 top-0 h-12 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(0,0,0,.45),transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 pointer-events-none h-14" style={{ background: "linear-gradient(0deg,rgba(0,0,0,.45),transparent)" }} />

        {/* logo/fallback */}
        <div className="absolute flex items-center gap-2 left-3 top-3">
          <img
            src={logo}
            alt="logo"
            className={`h-6 w-6 rounded ${logoOk ? "" : "hidden"}`}
            onLoad={() => setLogoOk(true)}
            onError={() => setLogoOk(false)}
            referrerPolicy="no-referrer"
          />
          {!logoOk && (
            <img
              src={favicon}
              alt="favicon"
              className="w-6 h-6 rounded"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="text-xs font-semibold text-slate-100/90">{host}</span>
        </div>

        {/* flèche ↗ discrète (plus de bouton “Ouvrir”) */}
        <div className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/30 px-2 py-[2px] text-xs text-slate-100 opacity-0 transition-opacity group-hover:opacity-100">
          ↗
        </div>

        {/* glow subtil au survol */}
        <div className="absolute inset-0 transition-opacity opacity-0 pointer-events-none group-hover:opacity-100"
             style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)" }} />
      </div>

      {/* caption sous la tuile */}
      <div className="px-2.5 py-2 text-center">
        <div className="text-sm font-semibold text-slate-100 line-clamp-1">{title}</div>
        <div className="text-xs text-slate-400">{host}</div>
      </div>
    </a>
  );
}

/* ============ Section principale ============ */
export default function EntrepriseSection() {
  const [focus, setFocus] = useState("both"); // both | alafrench | care

  const Switch = useMemo(
    () => (
      <div className="flex items-center gap-[0.382rem]">
        <Pill>H2O</Pill>
        <div className="hidden sm:flex items-center gap-[0.382rem] text-xs">
          <button
            className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "both" ? "bg-white/10" : ""}`}
            onClick={() => setFocus("both")}
          >
            Shopify & Custom
          </button>
          <button
            className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "alafrench" ? "bg-white/10" : ""}`}
            onClick={() => setFocus("alafrench")}
          >
            Focus ALAFRENCH
          </button>
          <button
            className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "care" ? "bg-white/10" : ""}`}
            onClick={() => setFocus("care")}
          >
            Focus ALAFRENCHCARE
          </button>
        </div>
      </div>
    ),
    [focus]
  );

  return (
    <section
      id="entreprise"
      className="min-h-[100svh] snap-center text-slate-100"
      style={{
        background:
          "radial-gradient(60% 60% at 50% 0%, rgba(212,175,55,.08), transparent 62%)," +
          "radial-gradient(40% 40% at 80% 80%, rgba(147,51,234,.06), transparent 62%), " +
          THEME.bg,
        padding: `${(INV * PHI) * PHI}rem ${1.0 * PHI}rem`,
      }}
    >
      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
      `}</style>

      <div className="w-full mx-auto" style={{ maxWidth: `${56 * PHI}rem` }}>
        {/* Header CENTRÉ */}
        <header className="mb-[1.0rem] text-center">
          <h2
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
              fontSize: `clamp(1.8rem, ${1.618 * PHI}rem, 3rem)`,
              lineHeight: 1.0 + INV,
            }}
          >
            H2O — Groupe & marques
          </h2>
          <p className="mx-auto mt-[0.382rem] max-w-3xl text-[0.95rem]" style={{ color: THEME.sub }}>
            <strong>H2O</strong> opère en tant que sociétée mère. <strong>ALAFRENCH</strong> (marque textile) et{" "}
            <strong>ALAFRENCHCARE</strong> (cosmétique) sont des <em>marques déposées</em> de H2O. Deux associés, exécution pragmatique :
            priorité textile, cosmétique sur une cadence plus longue (qualité & conformité).
          </p>

          <div className="mt-[0.618rem] flex flex-wrap items-center justify-center gap-[0.382rem]">
            <a
              href="https://www.instagram.com/ALAFRENCH"
              target="_blank"
              rel="noreferrer"
              className="px-[0.9rem] py-[0.5rem] rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs"
              title="Instagram @ALAFRENCH"
            >
              📸 Instagram <span className="opacity-70">@ALAFRENCH</span>
            </a>
            <Pill>Communautés actives (Snap / TikTok)</Pill>
            <Pill>Réseau & partenariats solides</Pill>
          </div>
        </header>

        {/* Grille centrée, colonnes égales, panneaux = même hauteur */}
        <div className="grid grid-cols-1 gap-[1.0rem] lg:grid-cols-2 auto-rows-fr">
          {/* Colonne 1 — Positionnement & services */}
          <div className="h-full">
            <Panel
              title="Positionnement & axes d’exécution"
              subtitle="Pilotage de marques • DTC e-commerce • Opérations & go-to-market"
              right={<Pill>2 associés</Pill>}
            >
              <ul className="space-y-[0.382rem]" style={{ color: THEME.text, fontSize: `${0.95}rem` }}>
                <li>• <strong>Stratégie de marque</strong> : création d’identité, <em>brand book</em>, chartes, naming & storytelling.</li>
                <li>• <strong>Refonte / amélioration d’identité</strong> : audit, repositionnement, déclinaisons multi-canales.</li>
                <li>• <strong>Graphisme & contenus</strong> : logos, bannières, templates, motion, montages photo/vidéo.</li>
                <li>• <strong>Production visuelle</strong> : direction artistique, <em>photoshooting</em>, tournage & post-prod.</li>
                <li>• <strong>Sites web</strong> : vitrines & e-commerce (Shopify), ou custom (Next.js/React, API, intégrations).</li>
                <li>• <strong>Automatisations</strong> : catalogues, webhooks, CRM, analytics, tracking, reporting.</li>
                <li>• <strong>Marketing</strong> : SEO/SEA, social, influence, campagnes & opérations de lancement.</li>
                <li>• <strong>Partenariats & distribution</strong> : co-branding, prod, logistique & supply-chain.</li>
              </ul>

              <div className="mt-[0.618rem] grid grid-cols-2 gap-[0.618rem]">
                <div className="rounded-md border border-white/10 bg-white/5 p-[0.618rem]">
                  <div className="text-[0.9rem] font-semibold">Marques déposées</div>
                  <div className="text-xs" style={{ color: THEME.sub }}>ALAFRENCH • ALAFRENCHCARE</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-[0.618rem]">
                  <div className="text-[0.9rem] font-semibold">Canaux</div>
                  <div className="text-xs" style={{ color: THEME.sub }}>Instagram • Snap • TikTok</div>
                </div>
              </div>

              <div className="mt-[0.618rem] flex flex-wrap items-center justify-center gap-[0.618rem]">
                <a
                  href="#contact"
                  className="px-[1.0rem] py-[0.5rem] text-sm font-bold rounded-lg border border-white/10 bg-white/10 hover:bg-white/20"
                >
                  ✉️ Me contacter
                </a>
                <a
                  href="#contact"
                  className="px-[1.0rem] py-[0.5rem] text-sm font-bold rounded-lg border border-white/10 hover:bg-white/10"
                >
                  💡 Discuter d’une idée
                </a>
              </div>

              <p className="mt-[0.382rem] text-center text-xs" style={{ color: THEME.sub }}>
                Ouverture : entrepreneuriat, création de marque, structuration d’offre, GTM, collaborations.
              </p>
            </Panel>
          </div>

          {/* Colonne 2 — Portails officiels avec screenshots */}
          <div className="h-full">
            <Panel
              title="Portails officiels"
              subtitle="Aperçus visuels — ouvrir pour consulter les sites"
              right={
                <div className="hidden sm:flex items-center gap-[0.382rem] text-xs">
                  <Pill>H2O</Pill>
                  <button
                    className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "both" ? "bg-white/10" : ""}`}
                    onClick={() => setFocus("both")}
                  >
                    Online Shop
                  </button>
                  <button
                    className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "alafrench" ? "bg-white/10" : ""}`}
                    onClick={() => setFocus("alafrench")}
                  >
                    ALAFRENCH
                  </button>
                  <button
                    className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "care" ? "bg-white/10" : ""}`}
                    onClick={() => setFocus("care")}
                  >
                    ALAFRENCHCARE
                  </button>
                </div>
              }
              bodyClass="pt-[0.236rem]"
            >
              {/* switch mobile */}
              <div className="sm:hidden mb-[0.618rem] flex items-center justify-center gap-[0.382rem] text-xs">
                <Pill>H2O</Pill>
                <button
                  className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "both" ? "bg-white/10" : ""}`}
                  onClick={() => setFocus("both")}
                >
                  Deux fenêtres
                </button>
                <button
                  className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "alafrench" ? "bg-white/10" : ""}`}
                  onClick={() => setFocus("alafrench")}
                >
                  ALAFRENCH
                </button>
                <button
                  className={`px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 ${focus === "care" ? "bg-white/10" : ""}`}
                  onClick={() => setFocus("care")}
                >
                  ALAFRENCHCARE
                </button>
              </div>

              {focus === "both" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.618rem]">
                  <SiteWindow title="ALAFRENCH — alafrench.fr" url="https://alafrench.fr" accent={THEME.brandTo} />
                  <SiteWindow title="ALAFRENCHCARE — alafrenchcare.com" url="https://alafrenchcare.com" accent={THEME.brandFrom} />
                </div>
              ) : focus === "alafrench" ? (
                <SiteWindow title="ALAFRENCH — alafrench.fr" url="https://alafrench.fr" accent={THEME.brandTo} />
              ) : (
                <SiteWindow title="ALAFRENCHCARE — alafrenchcare.com" url="https://alafrenchcare.com" accent={THEME.brandFrom} />
              )}

              <div className="mt-[0.618rem] grid grid-cols-1 md:grid-cols-2 gap-[0.618rem]">
                <div className="rounded-md border border-white/10 bg-white/5 p-[0.618rem]">
                  <div className="text-[0.95rem] font-semibold">ALAFRENCH — Marque textile</div>
                  <div className="text-xs" style={{ color: THEME.sub }}>
                    Priorité : collections, plateforme DTC, collaborations ciblées.
                  </div>
                  <div className="mt-[0.382rem]">
                    <a
                      href="https://alafrench.fr"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 inline-block"
                    >
                      ↗ alafrench.fr
                    </a>
                  </div>
                </div>

                <div className="rounded-md border border-white/10 bg-white/5 p-[0.618rem]">
                  <div className="text-[0.95rem] font-semibold">ALAFRENCHCARE — Cosmétique</div>
                  <div className="text-xs" style={{ color: THEME.sub }}>
                    Cadence plus longue : sourcing, qualité, conformité et supply-chain.
                  </div>
                  <div className="mt-[0.382rem]">
                    <a
                      href="https://alafrenchcare.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2 py-[0.35rem] rounded-md border border-white/10 hover:bg-white/10 inline-block"
                    >
                      ↗ alafrenchcare.com
                    </a>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>

        {/* Bandeau final centré */}
        <div className="mt-[1.0rem] text-center" style={{ color: THEME.sub, fontSize: `${0.95}rem` }}>
          Implication sur projets créatifs (direction artistique, contenu, opérations de lancement).  
          Intéressé par une collaboration ? <a href="#contact" className="underline hover:no-underline">Entrons en contact</a>.
        </div>
      </div>
    </section>
  );
}
