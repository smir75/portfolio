import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import SpaceDecor from "@/scenes/core/SpaceDecor";
import FailSafeLight from "@/scenes/core/FailSafeLight";
import SunMoonCycle from "@/scenes/sky/SunMoonCycle";
import Nebulae from "@/scenes/sky/Nebulae";
import FlybyShips from "@/scenes/sky/FlybyShips";
import Moon from "@/scenes/terrain/Moon";
import Rocks from "@/scenes/terrain/Rocks";
import SurfaceParticles from "@/scenes/terrain/SurfaceParticles";
import AsteroidBelt from "@/scenes/belt/AsteroidBelt";
import Satellites from "@/scenes/orbit/Satellites";
import Stations from "@/scenes/stations/Stations";
import buildStations from "@/scenes/stations/buildStations";
import Dust from "@/scenes/actors/Dust";
import Astronaut from "@/scenes/actors/Astronaut";
import Rivers from "@/scenes/cities/Rivers";
import Settlements from "@/scenes/cities/Settlements";
import ClickAim from "@/scenes/nav/ClickAim";
import CameraRig from "@/scenes/nav/CameraRig";
import { clamp, angleBetween } from "@/utils/math3d";

const ACCEL = 2.6, DAMP = 2.0, MAX_SPEED = 2.1, STEER = 3.6;
const JUMP_V = 1.12, GRAV = 1.5, ALT_DAMP = 1.6;
const ROCK_COUNT = 280, SURF_PARTICLES = 520, BELT_PARTS = 360, SAT_COUNT = 7;
const ENTER_OPEN = 0.20;

export default function Scene({
  RADIUS,
  navTarget,
  onNavConsumed,
  onOpenStation,
  quality,
  reduceMotion,
  highContrast,
  worldQuatRef,
  zoomRef,
}) {
  // input
  const input = useSimpleInput();

  // orientation et cible
  const qWorldRef = useRef(new THREE.Quaternion());
  const qTargetRef = useRef(null);

  // planet spin
  const worldGroup = useRef();     // suit qWorldRef
  const spinGroup = useRef();      // tourne en continu
  const spinSpeed = 0.02;
  const spinYRef = useRef(0);      // exposé pour corriger le clic

  // etats dynamiques
  const vy = useRef(0), vx = useRef(0);
  const [alt, setAlt] = useState(0);
  const vAlt = useRef(0);
  const sphereRef = useRef();      // mesh principal de la lune (raycast)
  const [bursts, setBursts] = useState([]);
  const STATIONS = useMemo(() => buildStations(RADIUS), [RADIUS]);

  // expose qWorld pour la mini-map
  useFrame(() => { worldQuatRef?.current.copy(qWorldRef.current); });

  // -------- helpers d'aim ----------
  // convertit une direction *locale planète (pré-spin)* → monde
  const localToWorldDir = (vLocalUnit) => {
    const qSpin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), spinYRef.current);
    return vLocalUnit.clone().applyQuaternion(qSpin).applyQuaternion(qWorldRef.current);
  };

  const aimToLocal = (dirLocalUnit) => {
    const dirWorld = localToWorldDir(dirLocalUnit);
    const zPlus = new THREE.Vector3(0, 0, 1);
    const delta = new THREE.Quaternion().setFromUnitVectors(dirWorld, zPlus);
    qTargetRef.current = delta.multiply(qWorldRef.current).normalize();
  };

  // mini-map envoie une direction locale *raw* (pré-spin déjà)
  const aimToLocalRaw = (dirLocalUnit) => {
    const zPlus = new THREE.Vector3(0, 0, 1);
    const dirWorld = dirLocalUnit.clone().applyQuaternion(qWorldRef.current);
    const delta = new THREE.Quaternion().setFromUnitVectors(dirWorld, zPlus);
    qTargetRef.current = delta.multiply(qWorldRef.current).normalize();
  };

  const aimToStation = (id) => {
    const s = STATIONS.find((x) => x.id === id);
    if (s) aimToLocal(s.pos.clone().normalize());
  };

  // nav par TopNav
  useEffect(() => {
    if (!navTarget) return;
    aimToStation(navTarget);
    onNavConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navTarget]);

  // bus d’événements : mini-map
  useEffect(() => {
    const onAimLocalRaw = (e) => {
      const { dir } = e.detail || {};
      if (!dir) return;
      aimToLocalRaw(new THREE.Vector3(dir[0], dir[1], dir[2]).normalize());
    };
    window.addEventListener("saga-aim-local-raw", onAimLocalRaw);
    return () => window.removeEventListener("saga-aim-local-raw", onAimLocalRaw);
  }, []);

  // boucle anim
  useFrame(({ clock }, dt) => {
    dt = Math.min(dt, 1 / 30);

    // spin auto (planète + stations + décors de surface)
    if (spinGroup.current) {
      spinGroup.current.rotation.y += spinSpeed * dt;
      spinYRef.current = spinGroup.current.rotation.y;
    }

    // slerp vers la cible (clic planète / mini-map / navbar)
    if (qTargetRef.current) {
      qWorldRef.current.slerp(qTargetRef.current, clamp(STEER * dt, 0, 0.22));
      const f = new THREE.Vector3(0, 0, 1).applyQuaternion(qWorldRef.current);
      const t = new THREE.Vector3(0, 0, 1).applyQuaternion(qTargetRef.current);
      if (angleBetween(f, t) < 0.01) {
        qWorldRef.current.copy(qTargetRef.current);
        qTargetRef.current = null;
      }
    }

    // contrôles
    let ay = 0, ax = 0;
    if (input.left) ay += ACCEL;
    if (input.right) ay -= ACCEL;
    if (input.up) ax += ACCEL;
    if (input.down) ax -= ACCEL;

    vy.current = clamp(vy.current + ay * dt, -MAX_SPEED, MAX_SPEED) * Math.exp(-DAMP * dt);
    vx.current = clamp(vx.current + ax * dt, -MAX_SPEED, MAX_SPEED) * Math.exp(-DAMP * dt);

    const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), vy.current * dt);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), vx.current * dt);
    qWorldRef.current.premultiply(qYaw).premultiply(qPitch).normalize();

    worldGroup.current?.quaternion.copy(qWorldRef.current);

    // saut / poussière
    if (input.jump && Math.abs(alt) < 0.001) vAlt.current = JUMP_V;
    vAlt.current = (vAlt.current - GRAV * dt) * Math.exp(-ALT_DAMP * dt);
    let next = alt + vAlt.current * dt;
    if (next < 0) {
      if (alt > 0.02) {
        const contact = new THREE.Vector3(0, 0, RADIUS).applyQuaternion(qWorldRef.current);
        setBursts((b) => [...b.slice(-6), { id: clock.getElapsedTime() + Math.random(), pos: contact, t0: clock.getElapsedTime() }]);
      }
      next = 0; vAlt.current = 0;
    }
    setAlt(next);
  });

  // Entrée = station face caméra (prend en compte le spin)
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Enter") return;
      const zPlus = new THREE.Vector3(0, 0, 1);
      let best = null, bestAng = Infinity;
      STATIONS.forEach((s) => {
        const dirW = localToWorldDir(s.pos.clone().normalize());
        const ang = angleBetween(zPlus, dirW);
        if (ang < bestAng) { bestAng = ang; best = s.id; }
      });
      if (bestAng < ENTER_OPEN) onOpenStation(best);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [STATIONS, onOpenStation]); // eslint-disable-line

  const leanX = THREE.MathUtils.clamp(-vx.current * 0.15, -0.25, 0.25);
  const leanY = THREE.MathUtils.clamp(vy.current * 0.12, -0.22, 0.22);
  const thrusterPower = clamp(Math.abs(vx.current) + Math.abs(vy.current) + (alt > 0 ? 0.8 : 0), 0, 1);

  const qLow = quality === "low";
  const rockCount = qLow ? Math.floor(ROCK_COUNT * 0.5) : ROCK_COUNT;
  const surfCount = qLow ? Math.floor(SURF_PARTICLES * 0.5) : SURF_PARTICLES;
  const beltCount = qLow ? Math.floor(BELT_PARTS * 0.6) : BELT_PARTS;
  const satCount  = qLow ? Math.max(2, Math.floor(SAT_COUNT * 0.6)) : SAT_COUNT;

  return (
    <>
      {/* décor global */}
      <SpaceDecor />
      <SunMoonCycle />
      <FailSafeLight />

      {/* planète + tout ce qui "colle" au sol (et tourne lentement) */}
      <group ref={worldGroup}>
        <group ref={spinGroup}>
          <group>
            <Moon RADIUS={RADIUS} ref={sphereRef} highContrast={highContrast} />
            <Rocks RADIUS={RADIUS} count={rockCount} />
            <SurfaceParticles RADIUS={RADIUS} count={surfCount} reduceMotion={reduceMotion} />
            <Stations RADIUS={RADIUS} qWorldRef={qWorldRef} onOpen={onOpenStation} highContrast={highContrast} />
            <Rivers RADIUS={RADIUS} count={3} color="#8fa5b3" />
            <Settlements RADIUS={RADIUS} count={5} />
            <Dust bursts={bursts} />
          </group>
        </group>
      </group>

      {/* entourage indépendant du spin planète */}
      <AsteroidBelt
        RADIUS={RADIUS}
        count={Math.floor(beltCount * 0.8)}
        reduceMotion={reduceMotion}
        tilt={0.45}
        centerOffset={0.0}
        inner={3.2}
        outer={4.8}
      />
      <Satellites RADIUS={RADIUS} count={satCount} reduceMotion={reduceMotion} />

      <Nebulae />
      <FlybyShips />

      {/* acteur indépendant */}
      <Astronaut RADIUS={RADIUS} alt={alt} leanX={leanX} leanY={leanY} thrusterPower={thrusterPower} />

      {/* Clic planète → onAimLocal (corrigé avec le spin) */}
      <ClickAim
        sphereRef={sphereRef}
        qWorldRef={qWorldRef}
        spinYRef={spinYRef}
        onAimLocal={aimToLocal}
      />

      <CameraRig RADIUS={RADIUS} zoomRef={zoomRef} />
    </>
  );
}

// input
function useSimpleInput() {
  const [i, set] = useState({ up: false, down: false, left: false, right: false, jump: false });
  useEffect(() => {
    const down = (e) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) set((s) => ({ ...s, up: true }));
      if (["ArrowDown", "KeyS"].includes(e.code)) set((s) => ({ ...s, down: true }));
      if (["ArrowLeft", "KeyA"].includes(e.code)) set((s) => ({ ...s, left: true }));
      if (["ArrowRight", "KeyD"].includes(e.code)) set((s) => ({ ...s, right: true }));
      if (e.code === "Space") set((s) => ({ ...s, jump: true }));
    };
    const up = (e) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) set((s) => ({ ...s, up: false }));
      if (["ArrowDown", "KeyS"].includes(e.code)) set((s) => ({ ...s, down: false }));
      if (["ArrowLeft", "KeyA"].includes(e.code)) set((s) => ({ ...s, left: false }));
      if (["ArrowRight", "KeyD"].includes(e.code)) set((s) => ({ ...s, right: false }));
      if (e.code === "Space") set((s) => ({ ...s, jump: false }));
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return i;
}
