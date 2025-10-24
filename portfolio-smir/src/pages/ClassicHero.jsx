// src/pages/ClassicHero.jsx
import React, { useEffect, useRef, useState } from "react";

/* ===== Golden ratio ===== */
const PHI = 1.618;

/* ===== Avatar (dans /public) ===== */
const AVATAR_URL = "/avatar-smir.png"; // place /public/avatar-smir.png

export default function ClassicHero() {
  const canvasRef = useRef(null);
  const [showCrawl, setShowCrawl] = useState(true);
  const [playingKey, setPlayingKey] = useState(0);

  /* ===== Starfield canvas ===== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let raf = 0;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let t0 = performance.now();

    const COUNT = Math.floor((W * H) / 8000);
    const stars = new Array(COUNT).fill(0).map(() => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 1 + 0.2,
      r: Math.random() * 1.5 + 0.3,
    }));

    function draw(now) {
      const dt = (now - t0) / 1000;
      t0 = now;

      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#0b1020");
      g.addColorStop(1, "#080d18");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const rad = ctx.createRadialGradient(W * 0.25, H * 0.2, 0, W * 0.25, H * 0.2, W * 0.45);
      rad.addColorStop(0, "rgba(212,175,55,0.08)");
      rad.addColorStop(1, "transparent");
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, W, H);
      const rad2 = ctx.createRadialGradient(W * 0.85, H * 0.8, 0, W * 0.85, H * 0.8, W * 0.35);
      rad2.addColorStop(0, "rgba(147,51,234,0.07)");
      rad2.addColorStop(1, "transparent");
      ctx.fillStyle = rad2;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y += (25 + 55 * s.z) * dt;
        if (s.y > H) {
          s.y = -10;
          s.x = Math.random() * W;
        }
        ctx.globalAlpha = 0.5 + 0.5 * s.z;
        ctx.fillStyle = "#e5ecff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.08 + 0.12 * s.z;
        ctx.fillRect(s.x - 0.3, s.y - s.r * 6, 0.6, s.r * 12);
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    function onResize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden text-slate-100 snap-center"
      aria-label="Bienvenue sur mon portfolio"
    >
      {/* BACKGROUND */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* HEADER FIXE (titre + punchline sous le titre) */}
      <header className="absolute left-0 right-0 z-30 px-6 pointer-events-none top-2 md:top-3">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-100 text-[12px] tracking-widest uppercase">
            Portfolio • Dev • Produits
          </div>
          <h1
            className="mt-3 font-extrabold leading-[1.06] text-center"
            style={{ fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif" }}
          >
            <span className="block text-[clamp(1.8rem,5vw,3.2rem)]">Bienvenue dans mon univers</span>
            <span className="block text-[clamp(1.3rem,4.2vw,2.4rem)] text-[#60a5fa] mt-[0.12em]">S. MIR</span>
          </h1>

          {/* Punchline sous le titre */}
          <p className="mt-2 text-sm italic text-slate-300/95">
            Là où la logique rencontre l&apos;imaginaire.
          </p>
        </div>
      </header>

      {/* CONTENU CENTRAL : avatar plus haut (libère la place pour l'intro) */}
      <div className="relative z-20 grid min-h-[100svh] px-6 content-start pt-[18vh] md:pt-[20vh]">

        <div className="flex flex-col items-center gap-3">
          <AvatarCard />
           <p className="mt-5 text-xs tracking-wide text-slate-400/90 fade-in">
    Builder · Dev · Ops
  </p>
        </div>
      </div>

      {/* INTRO STAR WARS (derrière avatar) */}
      {showCrawl && <StarCrawl key={playingKey} onEnd={() => setShowCrawl(false)} />}

      {/* FOOTER INFO (en bas du hero, ne gêne pas l'intro) */}
      <footer className="absolute left-0 right-0 z-30 px-6 bottom-10">
        <div className="max-w-3xl mx-auto space-y-2 text-center">
          <div className="pt-2">
            {showCrawl ? (
              <button
                onClick={() => setShowCrawl(false)}
                className="px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 transition text-sm"
              >
                ⏭ Passer l&apos;intro
              </button>
            ) : (
              <button
                onClick={() => {
                  setPlayingKey((k) => k + 1);
                  setShowCrawl(true);
                }}
                className="px-3 py-1.5 rounded-xl border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400/20 transition text-sm"
              >
                ▶ Rejouer l&apos;intro
              </button>
            )}
          </div>

          {/* hint scroll */}
          <div className="flex flex-col items-center pt-3">
            <span className="text-xs font-light tracking-wide text-slate-300/80">
              Faites défiler pour découvrir
            </span>
            <div className="relative w-5 h-5 mt-2">
              <svg
                className="absolute inset-0 w-full h-full animate-bounce-slow text-[#f5c542]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              <div className="absolute inset-0 blur-lg bg-[radial-gradient(closest-side,#f5c54233,transparent)] animate-pulse-slow rounded-full" />
            </div>
          </div>
        </div>
      </footer>

      {/* Top/Bottom glow lines */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#a41d28] to-transparent opacity-60" />

      <style>{`
        @keyframes bounce-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        .animate-bounce-slow{ animation:bounce-slow 2.4s ease-in-out infinite; }
        @keyframes pulse-slow{ 0%,100%{opacity:.6} 50%{opacity:1} }
        .animate-pulse-slow{ animation:pulse-slow 2.2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

/* ================================ */
/* Avatar encadré : carte verre + halo */
/* ================================ */
function AvatarCard() {
  return (
    <div className="relative">
      {/* Aura large derrière - effet circulaire */}
      <div
        aria-hidden
        className="absolute -inset-[18%] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(96,165,250,.18), rgba(168,85,247,.12), rgba(0,0,0,0) 70%)",
          filter: "blur(22px)",
        }}
      />

      {/* Anneau d'orbites EXTERNE au cadre (au-dessus du border) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          // rayon = moitié du conteneur + 6px pour passer au-dessus du bord
          "--orbitR": "calc(50% + 6px)",
        }}
      >
        <OrbitalSparksCircle dots={14} />
      </div>

      {/* Cadre circulaire type photo de profil */}
      <div
        className="relative overflow-hidden rounded-full"
        style={{
          width: `clamp(200px, 28vw, 320px)`,
          height: `clamp(200px, 28vw, 320px)`,
          background: "linear-gradient(135deg, rgba(14,20,38,.50), rgba(8,12,24,.50))",
          border: "3px solid rgba(96,165,250,.35)",
          boxShadow:
            "0 20px 70px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.1), 0 0 50px rgba(96,165,250,.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Anneau gradient tournant autour (léger) */}
        <div
          aria-hidden
          className="absolute -inset-[3px] pointer-events-none rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(34,211,238,.4), rgba(168,85,247,.3), rgba(34,211,238,.4))",
            opacity: 0.2,
            animation: "spin-halo 16s linear infinite",
            zIndex: -1,
          }}
        />

        {/* l'image PNG - centrée et cadrée sur le visage */}
        <img
          src={AVATAR_URL}
          alt="Avatar"
          className="absolute inset-0 object-cover w-full h-full select-none"
          style={{
            objectPosition: "center 35%",
          }}
          draggable={false}
          loading="eager"
        />
      </div>

      <style>{`
        @keyframes spin-halo { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function OrbitalSparksCircle({ dots = 12 }) {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: dots }).map((_, i) => {
        const dur = 8 + (i % 3);
        const delay = `${-i * 0.6}s`;
        return (
          <span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/90 shadow-[0_0_10px_rgba(34,211,238,1)]"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "center center",
              animation: `orbit-on-ring ${dur}s linear infinite`,
              animationDelay: delay,
            }}
          />
        );
      })}

      <style>{`
        @keyframes orbit-on-ring {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateY(calc(-1 * var(--orbitR)));
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateY(calc(-1 * var(--orbitR)));
          }
        }
      `}</style>
    </div>
  );
}

/* =================================== */
/* Star Wars style opening crawl block */
/* =================================== */
function StarCrawl({ onEnd }) {
  useEffect(() => {
    const t = setTimeout(() => onEnd?.(), 24000);
    return () => clearTimeout(t);
  }, [onEnd]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 pointer-events-none">
      {/* Hauteur ajustée pour s'arrêter sous l'avatar */}
      <div className="mx-auto max-w-4xl h-[35vh] perspective">
        <div className="crawl-wrapper">
          <div className="crawl">
            <p className="intro-quote">
              « Du code aux étoiles… bienvenue dans mon univers numérique. »
            </p>
            <p className="ep">Chapitre ZÉRO</p>
            <h2 className="title">Un virage calculé</h2>
            <p>
              Jadis, dans un système bancaire lointain, Sagar forgeait rigueur et relation client. Les process,
              les contrôles, la précision… autant d&apos;étoiles qui tracent des trajectoires fiables.
            </p>
            <p>
              Mais l&apos;appel du code grandissait. JavaScript, React, Node — de nouvelles constellations s&apos;ouvrent.
              Les bases de données deviennent des nébuleuses organisées, la sécurité un bouclier énergétique.
            </p>
            <p>
              Aujourd&apos;hui, cap sur la construction : produits utiles, e-commerce robuste, automation, design soigné.
              H2O, ALAFRENCH, ALAFRENCHCARE — des vaisseaux pensés pour durer, mesurer, itérer.
            </p>
            <p className="strong">
              Mission : transformer les idées en systèmes élégants et fiables. Toujours au service de l&apos;usage. Toujours vers l&apos;avant.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .perspective { perspective: 520px; }
        .crawl-wrapper {
          position: relative;
          height: 100%;
          overflow: hidden;
          mask-image: linear-gradient(0deg, transparent 0%, black 16%, black 86%, transparent 100%);
        }
        .crawl {
          position: absolute;
          bottom: -100%;
          width: 100%;
          transform-origin: 50% 100%;
          transform: rotateX(22deg);
          color: #feda4a;
          text-align: justify;
          font-size: clamp(12px, 1.6vw, 16px);
          letter-spacing: 0.02em;
          line-height: 1.62;
          font-weight: 600;
          animation: crawl-move 22s linear forwards;
          text-shadow: 0 2px 2px rgba(0,0,0,.35);
        }
        .crawl .intro-quote {
          text-align: center;
          font-size: clamp(14px, 1.8vw, 18px);
          font-style: italic;
          margin-bottom: 1.2rem;
          font-weight: 700;
          opacity: .95;
        }
        .crawl .ep { text-align:center; margin-bottom: .4rem; opacity: .9; }
        .crawl .title {
          text-align:center; font-size: clamp(16px, 2vw, 22px);
          margin-bottom: .6rem; font-weight: 800; letter-spacing:.06em;
        }
        .crawl p { margin: 0 0 .9rem 0; }
        .crawl p.strong { text-align:center; font-weight: 800; }
        @keyframes crawl-move {
          0%   { bottom: -95%; opacity: .0 }
          8%   { opacity: 1 }
          100% { bottom: 120%; opacity: 1 }
        }

        @keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: fade-in 1.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
