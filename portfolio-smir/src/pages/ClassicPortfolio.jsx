// src/pages/ClassicPortfolio.jsx
import React from "react";
import ClassicHero from "./ClassicHero";
import AboutSection from "./sections/AboutSection";
import BTSSection from "./sections/BTSSection";
import ParcoursSection from "./sections/ParcoursSection";
import ProjectsSection from "./sections/ProjectsSection";
import EasterEggMoon from "../components/EasterEggMoon";
import LeftDockNav from "../components/LeftDockNav";

export default function ClassicPortfolio() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <LeftDockNav />
      <ClassicHero />
      <AboutSection />
      <BTSSection />
      <ParcoursSection />

      {/* 👉 Affiche la vraie section Projets */}
      <ProjectsSection id="projets" />

      {/* placeholders des autres ancres du menu */}
      <section id="certifications" className="min-h-[100svh] snap-center flex items-center justify-center bg-[#0b1020] text-slate-200">
        <div className="max-w-3xl px-6 text-center opacity-80">Certifications — contenu à venir.</div>
      </section>
      <section id="veille" className="min-h-[100svh] snap-center flex items-center justify-center bg-[#0a0f1c] text-slate-200">
        <div className="max-w-3xl px-6 text-center opacity-80">Veille technologique — contenu à venir.</div>
      </section>
      <section id="entreprise" className="min-h-[100svh] snap-center flex items-center justify-center bg-[#0b1020] text-slate-200">
        <div className="max-w-3xl px-6 text-center opacity-80">Mon entreprise — contenu à venir.</div>
      </section>
      <section id="ecole" className="min-h-[100svh] snap-center flex items-center justify-center bg-[#0a0f1c] text-slate-200">
        <div className="max-w-3xl px-6 text-center opacity-80">École — contenu à venir.</div>
      </section>
      <section id="contact" className="min-h-[100svh] snap-center flex items-center justify-center bg-[#0b1020] text-slate-200">
        <div className="max-w-3xl px-6 text-center opacity-80">Contact — contenu à venir.</div>
      </section>

      <EasterEggMoon />
    </main>
  );
}
