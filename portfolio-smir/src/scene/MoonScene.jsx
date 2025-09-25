// src/scene/MoonScene.jsx
import React, { useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

import { useSettings } from "@/state/settings.jsx";
import { BASE_RADIUS } from "@/constants/space";

import Scene from "@/scenes/core/Scene";
import OverlayUI from "@/scenes/ui/OverlayUI";
import Modal from "@/scenes/ui/Modal";
import TopNav from "@/scenes/ui/TopNav";
import buildStations from "@/scenes/stations/buildStations";

// ✅ nouveau contrôleur entrée joueur (clavier + clic planète)
import PlayerInput from "@/scenes/controls/PlayerInput";

/* -----------------------------------------
   WorldRotator
   Slerp (interpolation sphérique) du quaternion "monde"
   vers un quaternion cible, avec "snap" en fin de rotation.
   - worldQuatRef : orientation actuelle du monde
   - targetQuatRef : orientation cible
   - speed : vitesse de slerp (plus grand = plus rapide)
   ----------------------------------------- */
function WorldRotator({ worldQuatRef, targetQuatRef, speed = 6 }) {
  // Flag pour empêcher le spam de clics pendant une rotation en cours
  const busyRef = useRef(false);

  useFrame((_, dt) => {
    const curr = worldQuatRef.current;
    const target = targetQuatRef.current;

    const dot = Math.abs(curr.dot(target));
    // Alignement quasi parfait → "snap" pour finir proprement
    if (1 - dot < 1e-5) {
      curr.copy(target).normalize();
      busyRef.current = false;
      return;
    }
    // Rotation en cours
    busyRef.current = true;
    curr.slerp(target, Math.min(1, speed * dt)).normalize();
  });

  // Expose un flag statique lisible ailleurs (pour throttle les clics)
  WorldRotator.isBusy = busyRef;
  return null;
}

export default function MoonScene() {
  const { settings } = useSettings();

  // État UI
  const [modal, setModal] = useState({ open: false, id: null });
  const [navTarget, setNavTarget] = useState(null);

  // Clé de remount Canvas (utile après "context lost" en dev)
  const [canvasKey, setCanvasKey] = useState(0);

  // Paramètres scène
  const RADIUS = BASE_RADIUS;
  const stationsForUI = useMemo(() => buildStations(RADIUS), [RADIUS]);

  // Orientation du monde :
  // - worldQuatRef est lu par la Scene
  // - targetQuatRef est la destination vers laquelle on slerp
  const worldQuatRef = useRef(new THREE.Quaternion());
  const targetQuatRef = useRef(new THREE.Quaternion().copy(worldQuatRef.current));

  // Zoom caméra (consommé par Scene)
  const zoomRef = useRef(0.25);

  // Évite remounts à l’infini si le contexte WebGL se perd plusieurs fois
  const lostOnceRef = useRef(false);

  /* -----------------------------------------
     onCanvasCreated
     - règle les options de rendu
     - capte "webglcontextlost" en *capture* pour éviter les logs bruyants
       et remonter proprement le Canvas une seule fois en dev
     ----------------------------------------- */
  const onCanvasCreated = useCallback(({ camera, gl }) => {
    camera.lookAt(0, 0, 0);

    gl.setClearColor("#050a16", 1);
    gl.shadowMap.enabled = false;
    gl.domElement.style.pointerEvents = "auto";

    // Qualité colorimétrique correcte
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;

    const canvas = gl.domElement;

    // ⚠️ Capture AVANT Three : évite le message "THREE.WebGLRenderer: Context Lost."
    const onLostCapture = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // coupe le handler interne de Three
      if (lostOnceRef.current) return;
      lostOnceRef.current = true;
      // Remount unique (utile en dev pour repartir proprement)
      setTimeout(() => setCanvasKey((k) => k + 1), 0);
    };

    const onRestored = () => {
      // Après restauration, on reset l’état GL si dispo (optionnel)
      try { gl.resetState(); } catch {}
    };

    canvas.addEventListener("webglcontextlost", onLostCapture, { capture: true, passive: false });
    canvas.addEventListener("webglcontextrestored", onRestored, { passive: true });

    // ✅ cleanup propre à l’unmount
    return () => {
      // Important: passer "true" pour retirer un listener enregistré avec { capture:true }
      canvas.removeEventListener("webglcontextlost", onLostCapture, true);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, []);

  // Handlers UI
  const handleModalClose   = useCallback(() => setModal({ open: false, id: null }), []);
  const handleNavTarget    = useCallback((id) => setNavTarget(id), []);
  const handleNavConsumed  = useCallback(() => setNavTarget(null), []);
  const handleOpenStation  = useCallback((id) => setModal({ open: true, id }), []);

  return (
    <div className="fixed inset-0 bg-black">
      {/* === Navbar fixe en haut (DOM normal, hors Canvas) === */}
      <div className="fixed inset-x-0 top-0 z-[120] pointer-events-auto">
        <TopNav stations={stationsForUI} onGo={handleNavTarget} />
      </div>

      {/* === Canvas 3D principal === */}
      <Canvas
        key={canvasKey}
        dpr={[1, 2]}             // Retina okay
        shadows={false}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 2.2, RADIUS * 3.2], fov: 42, near: 0.1, far: 1000 }}
        onCreated={onCanvasCreated}
        style={{ width: "100vw", height: "100vh", zIndex: 0, display: "block" }}
      >
        {/* Rotation douce du monde vers une cible */}
        <WorldRotator worldQuatRef={worldQuatRef} targetQuatRef={targetQuatRef} speed={6} />

        {/* 🎮 Entrées joueur (clavier + clic planète) + feedback d’orientation */}
        <PlayerInput
          RADIUS={RADIUS}
          worldQuatRef={worldQuatRef}
          targetQuatRef={targetQuatRef}
        />

        {/* Ta scène 3D : consomme navTarget + refs (worldQuatRef / zoomRef) */}
        <Scene
          RADIUS={RADIUS}
          navTarget={navTarget}
          onNavConsumed={handleNavConsumed}
          onOpenStation={handleOpenStation}
          quality={settings.quality}
          reduceMotion={settings.reduceMotion || settings.presentation}
          highContrast={settings.highContrast}
          worldQuatRef={worldQuatRef}
          zoomRef={zoomRef}
        />
      </Canvas>

      {/* === Overlay DOM (portal) : bouton Réglages + badge === */}
      <OverlayUI />

      {/* === Modale d’infos === */}
      <Modal
        open={modal.open}
        title={
          modal.id === "projets"     ? "Projets" :
          modal.id === "competences" ? "Compétences" :
          modal.id === "parcours"    ? "Parcours" :
          modal.id === "contact"     ? "Contact" :
          modal.id === "bts"         ? "BTS / Référentiel" : ""
        }
        onClose={handleModalClose}
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
