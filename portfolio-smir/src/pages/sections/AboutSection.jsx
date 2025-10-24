// src/pages/sections/AboutSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import CodeFlipCard from "../../components/CodeFlipCard";

export default function AboutSection() {
  return (
  <section
  id="about"
  className="min-h-[100svh] text-slate-100 flex items-center snap-center bg-[rgba(8,12,24,0.5)] backdrop-blur-[2px] border-t border-white/5"
>
      <div className="container px-6 py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 md:grid-cols-2">
          <CodeFlipCard />

          <div>
            <h2
              className="text-3xl font-extrabold tracking-tight md:text-4xl"
              style={{ fontFamily: "OrbitronLocal, Orbitron, system-ui, sans-serif" }}
            >
              À propos
            </h2>

            <div className="mt-4 space-y-3 text-[15.5px] md:text-base leading-relaxed text-slate-300/90">
              <p>
                Aujourd’hui, je suis <strong>alternant développeur web chez CPMS</strong>. 
                Je prépare un <strong>BTS SIO option SLAM</strong> à la 
                <strong> Digital School of Paris</strong> (groupe <strong>IEF2I</strong>), 
                diplôme prévu <strong>juin 2026</strong>.
              </p>

              <p>
                Avant cela, j’ai fondé la société <strong>H2O</strong> et créé la marque 
                <strong> ALAFRENCH CARE</strong>. Une aventure qui m’a donné la vision, le sens du produit 
                et l’exigence du rendu.
              </p>

              <p>
                Plus tôt, j’ai évolué à <strong>La Banque Postale</strong> comme <strong>chargé</strong> puis 
                <strong> conseiller clientèle</strong>, avec un <strong>Titre SOFTEC</strong> 
                (équivalent licence banque). J’y ai cultivé la confiance, la précision et le résultat.
              </p>

              <p>
                Auparavant, j’ai travaillé en <strong>hôtellerie 5★</strong> en réception, 
                après une première expérience terrain comme <strong>installateur fibre optique</strong>, 
                à la suite d’un <strong>Bac STMG</strong>.
              </p>

              <p className="italic text-slate-400/90">
                J’ai quitté la banque pour créer des expériences. Même exigence, nouvel horizon.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {[
                "Reconversion professionnelle",
                "Relation humaine",
                "Entrepreneuriat",
                "Vision produit",
                "Créativité",
                "Confiance",
              ].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/10 text-[13px]">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-7">
              <a
                href="/cv_smir.pdf"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-[#233062] hover:bg-[#2a3973] transition shadow-md"
              >
                Télécharger mon CV
              </a>

              <Link
                to="/Contact"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white/95 text-[#0b1020] hover:bg-white transition shadow-md"
              >
                Me contacter
              </Link>

              <a
                href="https://alafrenchcare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-[#0f172a] border border-white/15 hover:bg-[#111b31] transition shadow-md"
              >
                Aller sur alafrenchcare.com
              </a>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs italic text-slate-500">
          Certains horizons cachent plus qu’ils ne montrent…
        </p>
      </div>
    </section>
  );
}
