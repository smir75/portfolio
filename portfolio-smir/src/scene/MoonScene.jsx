import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

/* state */
import { useSettings } from "@/state/settings.jsx";

/* constants */
import { BASE_RADIUS } from "@/constants/space";

/* orchestrator */
import Scene from "@/scenes/core/Scene";

/* ui */
import OverlayUI from "@/scenes/ui/OverlayUI";
import Modal from "@/scenes/ui/Modal";
import TopNav from "@/scenes/ui/TopNav";

/* stations list for navbar tooltips */
import buildStations from "@/scenes/stations/buildStations";

export default function MoonScene() {
  const { settings } = useSettings();
  const [modal, setModal] = useState({ open: false, id: null });
  const [navTarget, setNavTarget] = useState(null);

  const RADIUS = BASE_RADIUS;
  const stationsForUI = useMemo(() => buildStations(RADIUS), [RADIUS]);
  const worldQuatRef = useRef(new THREE.Quaternion());
  const zoomRef = useRef(0.25);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Navbar DOM (au-dessus du canvas) */}
      <div className="fixed inset-x-0 top-0 z-[120] pointer-events-auto">
        <TopNav stations={stationsForUI} onGo={(id) => setNavTarget(id)} />
      </div>

      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, powerPreference: "high-performance", toneMappingExposure: 1.0 }}
        camera={{ position: [0, 2.2, RADIUS * 3.2], fov: 42 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        style={{ width: "100vw", height: "100vh", zIndex: 0 }}
      >
        <Scene
          RADIUS={RADIUS}
          navTarget={navTarget}
          onNavConsumed={() => setNavTarget(null)}
          onOpenStation={(id) => setModal({ open: true, id })}
          quality={settings.quality}
          reduceMotion={settings.reduceMotion || settings.presentation}
          highContrast={settings.highContrast}
          worldQuatRef={worldQuatRef}
          zoomRef={zoomRef}
        />

        <OverlayUI worldQuatRef={worldQuatRef} stations={stationsForUI} />
      </Canvas>

      <Modal
        open={modal.open}
        title={
          modal.id === "projets" ? "Projets" :
          modal.id === "competences" ? "Compétences" :
          modal.id === "parcours" ? "Parcours" :
          modal.id === "contact" ? "Contact" :
          modal.id === "bts" ? "BTS / Référentiel" : ""
        }
        onClose={() => setModal({ open: false, id: null })}
      >
        {modal.id === "projets" && (
          <ul className="pl-5 space-y-1 list-disc">
            <li>Intranet AD/LDAP + AS400 (Laravel / Vue 3)</li>
            <li>API REST sécurisée (Laravel Sanctum)</li>
            <li>Scripts d’automatisation Python (backup, ETL)</li>
            <li>Site vitrine (Tailwind / Vite)</li>
          </ul>
        )}
        {modal.id === "competences" && (
          <ul className="pl-5 space-y-1 list-disc">
            <li>PHP (Laravel), JavaScript (Vue/React)</li>
            <li>SQL (MariaDB), Modélisation</li>
            <li>Git, Docker, Linux/WSL2</li>
            <li>CI/CD (GitLab CI / GitHub Actions)</li>
          </ul>
        )}
        {modal.id === "parcours" && (
          <div>
            <p><strong>BTS SIO – SLAM</strong> (2024–2026)</p>
            <p>Alternance : intranet (AD, AS400, sécurité…)</p>
          </div>
        )}
        {modal.id === "contact" && (
          <div>
            <p>LinkedIn • GitHub • Mail</p>
            <p className="text-sm text-slate-400">Formulaire à venir</p>
          </div>
        )}
        {modal.id === "bts" && (
          <div>
            <p><strong>Référentiel BTS SIO</strong> — liens entre E4/E5 et tes projets, compétences validées, etc.</p>
            <p className="text-sm text-slate-400">À brancher sur un JSON plus tard.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
