// src/pages/ClassicHero.jsx
import React from "react";

export default function ClassicHero() {
  return (
    <section
    id="hero"
    className="relative min-h-[100svh] w-full overflow-hidden bg-[#0b1020] text-slate-100 snap-center"
    aria-label="Bienvenue sur mon portfolio"
    >
      {/* === FOND ANIMÉ === */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -inset-40 rounded-[999px] bg-gradient-to-br from-[#142045] via-[#0b1020] to-black opacity-90 animate-slow-pan" />
        <div className="absolute top-1/3 left-1/4 w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(closest-side,#d4af3720,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(closest-side,#a41d2824,transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('/noise.png')]" />
      </div>

      {/* === CONTENU === */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <p className="mb-3 text-sm/none tracking-widest text-[#f5c542] uppercase">
          Portefeuille • Projets • Expérimentations
        </p>

        <h1
          className="text-center font-extrabold leading-[1.02]"
          style={{
            fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif",
          }}
        >
          <span className="block text-[clamp(2rem,6.5vw,5rem)]">
            Bienvenue sur mon portfolio
          </span>
          <span className="block text-[clamp(1.6rem,5.2vw,4rem)] text-[#60a5fa] mt-1">
            S. MIR
          </span>
        </h1>

        <p className="font-medium tracking-wide animate-fade-up text-slate-100/95">
        « Du code aux étoiles ... bienvenue dans mon univers numérique. »
        </p>
        <p
        className="italic animate-fade-up-delayed text-slate-400/90"
        style={{ animationDelay: "0.9s" }}
        >
            Là où la logique rencontre l’imaginaire.
            </p>

        {/* === INDICATION SCROLL ANIMÉE === */}
        <div className="absolute flex flex-col items-center bottom-12">
          {/* texte animé */}
          <span className="text-sm font-light tracking-wide text-slate-300/80 animate-fade-up">
            Faites défiler pour découvrir
          </span>

          {/* flèche animée */}
          <div className="relative w-6 h-6 mt-3">
            <svg
              className="absolute inset-0 w-full h-full animate-bounce-slow text-[#f5c542]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>

            {/* halo autour de la flèche */}
            <div className="absolute inset-0 blur-lg bg-[radial-gradient(closest-side,#f5c54233,transparent)] animate-pulse-slow rounded-full" />
          </div>
        </div>
      </div>

      {/* Bordures décoratives haut/bas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#a41d28] to-transparent opacity-60" />
    </section>
  );
}
