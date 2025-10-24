// src/pages/ClassicPortfolio.jsx
import React from "react";
import ClassicHero from "./ClassicHero";
import AboutSection from "./sections/AboutSection";
import BTSSection from "./sections/BTSSection";
import ParcoursSection from "./sections/ParcoursSection";
import ProjectsSection from "./sections/ProjectsSection";
import CertificationsSection from "./sections/CertificationsSection";
import EasterEggMoon from "../components/EasterEggMoon";
import LeftDockNav from "../components/LeftDockNav";
import SchoolsSection from "./sections/SchoolsSection"; 
import VeilleSection from "./sections/VeilleSection";
import UserStorySection from "./sections/UserStorySection";
import EntrepriseSection from "./sections/EntrepriseSection";

export default function ClassicPortfolio() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <LeftDockNav />
      {/* Section Hero  */}
      <ClassicHero />
      {/* Section À propos  */}
      <AboutSection /> 
      {/* Section BTS SIO  */}
      <BTSSection />
      {/* Section Parcours  */}
      <ParcoursSection />
      {/* section Projets */}
      <ProjectsSection id="projets" />
      {/* Section Certifications  */}
      <CertificationsSection />
      {/* Section Veille  */}
      <VeilleSection />
      {/* Section Entreprise  */}
      <EntrepriseSection />
      {/* Section Écoles */}
      <SchoolsSection />
      {/* Section User Story */}
      <UserStorySection />
      {/* Easter Egg Moon */} 
      <EasterEggMoon />
    </main>
  );
}
