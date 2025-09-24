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

/* Rotation douce du monde (slerp -> target) + snap fin */
function WorldRotator({ worldQuatRef, targetQuatRef, speed = 6 }) {
  const busyRef = useRef(false);

  useFrame((_, dt) => {
    const curr = worldQuatRef.current;
    const target = targetQuatRef.current;
    const dot = Math.abs(curr.dot(target));
    if (1 - dot < 1e-5) {
      curr.copy(target).normalize();
      busyRef.current = false;
      return;
    }
    busyRef.current = true;
    curr.slerp(target, Math.min(1, speed * dt)).normalize();
  });

  WorldRotator.isBusy = busyRef; // pour throttle le clic
  return null;
}

/* Clic planète → event "saga-aim-local-raw" + cible pour le slerp local */
function PickController({ RADIUS, worldQuatRef, targetQuatRef }) {
  const tmp = useMemo(
    () => ({
      invQ: new THREE.Quaternion(),
      pLocal: new THREE.Vector3(),
      anchor: new THREE.Vector3(0, 0, 1),
      rot: new THREE.Quaternion(),
      safeAxis: new THREE.Vector3(0, 1, 0),
    }),
    []
  );

  const handleClick = useCallback(
    (e) => {
      if (WorldRotator.isBusy?.current) return; // évite spam pendant rotation
      e.stopPropagation();

      // Monde -> local "pré-rotation monde"
      tmp.invQ.copy(worldQuatRef.current).invert();
      tmp.pLocal.copy(e.point).normalize().applyQuaternion(tmp.invQ);
      if (tmp.pLocal.lengthSq() < 1e-12) return;

      // 1) Event que Scene connaît déjà
      const ev = new CustomEvent("saga-aim-local-raw", {
        detail: { dir: [tmp.pLocal.x, tmp.pLocal.y, tmp.pLocal.z] },
      });
      window.dispatchEvent(ev);

      // 2) Slerp local (feedback immédiat)
      const dot = tmp.pLocal.dot(tmp.anchor);
      if (dot < -0.999999) {
        tmp.rot.setFromAxisAngle(tmp.safeAxis, Math.PI);
      } else {
        tmp.rot.setFromUnitVectors(tmp.pLocal, tmp.anchor);
      }
      targetQuatRef.current.copy(tmp.rot).normalize();
    },
    [tmp, worldQuatRef, targetQuatRef]
  );

  return (
    <mesh onClick={handleClick} renderOrder={-9999}>
      {/* Légèrement > rayon planète pour capter le clic en priorité */}
      <sphereGeometry args={[RADIUS + 0.01, 16, 12]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} />
    </mesh>
  );
}

export default function MoonScene() {
  const { settings } = useSettings();

  const [modal, setModal] = useState({ open: false, id: null });
  const [navTarget, setNavTarget] = useState(null);
  const [canvasKey, setCanvasKey] = useState(0);

  const RADIUS = BASE_RADIUS;
  const stationsForUI = useMemo(() => buildStations(RADIUS), [RADIUS]);

  const worldQuatRef = useRef(new THREE.Quaternion());
  const targetQuatRef = useRef(new THREE.Quaternion().copy(worldQuatRef.current));
  const zoomRef = useRef(0.25);

  const lostOnceRef = useRef(false); // empêche remounts en boucle en dev

  const onCanvasCreated = useCallback(({ camera, gl }) => {
    camera.lookAt(0, 0, 0);

    gl.setClearColor("#050a16", 1);
    gl.shadowMap.enabled = false;
    gl.domElement.style.pointerEvents = "auto";

    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;

    // Contexte WebGL pour events + cleanup propre
    const ctx =
      (typeof gl.getContext === "function" && gl.getContext()) ||
      gl.domElement?.getContext?.("webgl2") ||
      gl.domElement?.getContext?.("webgl") ||
      gl.domElement?.getContext?.("experimental-webgl");

    if (!ctx) return;

    const onLost = (e) => {
      e.preventDefault();
      if (lostOnceRef.current) return;
      lostOnceRef.current = true;
      // Remount unique en dev
      setTimeout(() => setCanvasKey((k) => k + 1), 0);
    };
    const onRestored = () => {
      try { gl.resetState(); } catch {}
    };

    ctx.canvas?.addEventListener?.("webglcontextlost", onLost, { passive: false });
    ctx.canvas?.addEventListener?.("webglcontextrestored", onRestored, { passive: true });

    // cleanup à l’unmount
    return () => {
      ctx.canvas?.removeEventListener?.("webglcontextlost", onLost);
      ctx.canvas?.removeEventListener?.("webglcontextrestored", onRestored);
    };
  }, []);

  const handleModalClose = useCallback(() => setModal({ open: false, id: null }), []);
  const handleNavTarget = useCallback((id) => setNavTarget(id), []);
  const handleNavConsumed = useCallback(() => setNavTarget(null), []);
  const handleOpenStation = useCallback((id) => setModal({ open: true, id }), []);

  return (
    <div className="fixed inset-0 bg-black">
      {/* TopNav (navbar unique) */}
      <div className="fixed inset-x-0 top-0 z-[120] pointer-events-auto">
        <TopNav stations={stationsForUI} onGo={handleNavTarget} />
      </div>

      <Canvas
        key={canvasKey}
        dpr={[1, 2]}
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
        {/* rotation douce */}
        <WorldRotator worldQuatRef={worldQuatRef} targetQuatRef={targetQuatRef} speed={6} />

        {/* clic direct planète */}
        <PickController RADIUS={RADIUS} worldQuatRef={worldQuatRef} targetQuatRef={targetQuatRef} />

        {/* ta scène 3D */}
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

      {/* Overlay DOM normal (hors Canvas) : bouton réglages + badge */}
      <OverlayUI />

      {/* Modale d’infos */}
      <Modal
        open={modal.open}
        title={
          modal.id === "projets" ? "Projets" :
          modal.id === "competences" ? "Compétences" :
          modal.id === "parcours" ? "Parcours" :
          modal.id === "contact" ? "Contact" :
          modal.id === "bts" ? "BTS / Référentiel" : ""
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
