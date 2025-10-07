// src/scenes/actors/Walkers.jsx
import React, { useMemo, useRef, useMemo as useMemoHook } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Aliens qui marchent sur la sphère :
 * - wander (tangente)
 * - attirés par les anchors (colonies)
 * - évitent l'astronaute (qWorldRef : +Z monde)
 */
export default function Walkers({
  RADIUS,
  qWorldRef,
  anchors = [],
  count = 24,
  size = 0.09,
  speed = 0.5,
  reduceMotion = false,
}) {
  // PRNG simple et stable
  const makeLCG = (seed = 0xC0FFEE) => {
    let s = (seed ^ Math.floor(RADIUS * 997)) >>> 0;
    return () => {
      s = (1664525 * s + 1013904223) >>> 0;
      return (s & 0xffffffff) / 0x100000000;
    };
  };

  const aliens = useMemo(() => {
    const rnd = makeLCG();
    const mkAlien = () => {
      // position uniforme sur la sphère
      const u = rnd() * 2 - 1;
      const phi = rnd() * Math.PI * 2;
      const rxy = Math.sqrt(1 - u * u);
      const pos = new THREE.Vector3(rxy * Math.cos(phi), u, rxy * Math.sin(phi)).normalize();

      // tangente initiale
      const any = Math.abs(pos.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
      const tang = new THREE.Vector3().crossVectors(pos, any).normalize();
      if (rnd() < 0.5) tang.multiplyScalar(-1);

      const baseOmega = (0.7 + 0.6 * rnd()) * speed * (reduceMotion ? 0.5 : 1);

      return {
        pos, tang,
        omega: baseOmega,                 // rad/s
        bobPhase: rnd() * Math.PI * 2,
        scale: size * (0.95 + 0.2 * rnd()),
        hueShift: (rnd() - 0.5) * 0.05,
      };
    };
    return Array.from({ length: count }, mkAlien);
  }, [RADIUS, count, size, speed, reduceMotion]);

  const groupRef = useRef();

  // helpers
  const tmpAxis = useMemoHook(() => new THREE.Vector3(), []);
  const tmpMat  = useMemoHook(() => new THREE.Matrix4(), []);
  const vTmp    = useMemoHook(() => new THREE.Vector3(), []);
  const ZERO = 1e-8;

  // poids de steering
  const W_WANDER = 1.0;
  const W_ANCHOR = 0.9;
  const W_AVOID  = 1.35;

  // cône d’évitement
  const AVOID_ANGLE = THREE.MathUtils.degToRad(35);
  const COS_AVOID   = Math.cos(AVOID_ANGLE);

  useFrame((_, rawDt) => {
    if (!groupRef.current) return;

    // dt sûr (évite gros sauts)
    const dt = Math.min(Math.max(rawDt || 0.016, 0.001), 0.05);

    // forward (monde) de l’astronaute = +Z appliqué à qWorldRef
    const astroFwd = vTmp.set(0, 0, 1).applyQuaternion(qWorldRef?.current || new THREE.Quaternion());

    const nodes = groupRef.current.children;
    const n = Math.min(nodes.length, aliens.length);

    for (let i = 0; i < n; i++) {
      const a = aliens[i];
      const node = nodes[i];
      if (!node) continue;

      // --- Steering tangent --- //
      let steer = a.tang.clone().multiplyScalar(W_WANDER);

      // Attraction vers colonie la plus alignée
      if (anchors.length) {
        let best = null, bestDot = -Infinity;
        for (const an of anchors) {
          const d = an.dot(a.pos);
          if (d > bestDot) { bestDot = d; best = an; }
        }
        if (best) {
          const toward = best.clone().sub(a.pos.clone().multiplyScalar(bestDot));
          if (toward.lengthSq() > ZERO) {
            toward.normalize();
            steer.addScaledVector(toward, W_ANCHOR);
          }
        }
      }

      // Évitement astronaute
      const facing = astroFwd.dot(a.pos);
      if (facing > COS_AVOID) {
        const away = a.pos.clone().multiplyScalar(facing).sub(astroFwd);
        if (away.lengthSq() > ZERO) {
          away.normalize().negate();
          steer.addScaledVector(away, W_AVOID);
        }
      }

      // Re-projection dans le plan tangent
      let tangentSteer = steer.sub(a.pos.clone().multiplyScalar(steer.dot(a.pos)));
      if (tangentSteer.lengthSq() < ZERO) tangentSteer.copy(a.tang);
      tangentSteer.normalize();

      // Rotation autour de l’axe tangent × normale
      const omega = a.omega * (facing > COS_AVOID ? 0.85 : 1.0);
      tmpAxis.crossVectors(tangentSteer, a.pos);
      if (tmpAxis.lengthSq() < ZERO) tmpAxis.crossVectors(a.tang, a.pos);
      if (tmpAxis.lengthSq() < ZERO) continue; // skip frame si axe trop petit
      tmpAxis.normalize();

      const angle = omega * dt;
      const qStep = new THREE.Quaternion().setFromAxisAngle(tmpAxis, angle);
      a.pos.applyQuaternion(qStep).normalize();
      a.tang.copy(tangentSteer);

      // --- Apparence / pose --- //
      const tNow = performance.now() / 1000;
      const bob = 0.028 * Math.sin(tNow * 7 + a.bobPhase);

      // Position (un poil au-dessus du sol)
      node.position.copy(a.pos).multiplyScalar(RADIUS + 0.02 + bob);

      // Orientation : basis explicite (right, up, forward)
      const up = a.pos.clone().normalize();
      const forward = a.tang.clone().normalize();
      const right = new THREE.Vector3().crossVectors(up, forward).normalize();
      forward.crossVectors(right, up).normalize(); // ré-orthogonalise
      tmpMat.makeBasis(right, up, forward);
      node.quaternion.setFromRotationMatrix(tmpMat);

      node.scale.setScalar(a.scale);
    }
  });

  // Petit alien “néon vert”
  const Alien = ({ scale = 0.09, hueShift = 0 }) => {
    const base = new THREE.Color("#39FF14").offsetHSL(hueShift, 0, 0);
    const eye = "#0b0b0b";
    return (
      <group scale={scale}>
        {/* shadow blob */}
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.14, 20]} />
          <meshBasicMaterial color="black" transparent opacity={0.18} depthWrite={false} />
        </mesh>

        {/* body */}
        <group>
          {/* tête */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshStandardMaterial
              color={base}
              roughness={0.45}
              metalness={0.05}
              emissive={base}
              emissiveIntensity={0.35}
            />
          </mesh>

          {/* yeux */}
          <mesh position={[-0.028, 0.158, -0.055]}>
            <sphereGeometry args={[0.013, 12, 12]} />
            <meshStandardMaterial color={eye} roughness={0.4} />
          </mesh>
          <mesh position={[0.028, 0.158, -0.055]}>
            <sphereGeometry args={[0.013, 12, 12]} />
            <meshStandardMaterial color={eye} roughness={0.4} />
          </mesh>

          {/* torse */}
          <mesh position={[0, 0.03, 0]}>
            <capsuleGeometry args={[0.055, 0.13, 6, 10]} />
            <meshStandardMaterial
              color={base}
              roughness={0.7}
              metalness={0.03}
              emissive={base}
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* bras */}
          <mesh position={[-0.065, 0.04, 0]} rotation={[0, 0, Math.PI * 0.18]}>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
            <meshStandardMaterial color={base} roughness={0.7} emissive={base} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0.065, 0.04, 0]} rotation={[0, 0, -Math.PI * 0.18]}>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
            <meshStandardMaterial color={base} roughness={0.7} emissive={base} emissiveIntensity={0.15} />
          </mesh>

          {/* jambes */}
          <mesh position={[-0.022, -0.06, 0]} rotation={[0, 0, Math.PI * 0.04]}>
            <cylinderGeometry args={[0.013, 0.013, 0.15, 8]} />
            <meshStandardMaterial color={base} roughness={0.7} emissive={base} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0.022, -0.06, 0]} rotation={[0, 0, -Math.PI * 0.04]}>
            <cylinderGeometry args={[0.013, 0.013, 0.15, 8]} />
            <meshStandardMaterial color={base} roughness={0.7} emissive={base} emissiveIntensity={0.15} />
          </mesh>
        </group>
      </group>
    );
  };

  return (
    <group ref={groupRef} frustumCulled={false}>
      {aliens.map((a, i) => (
        <group key={i} frustumCulled={false}>
          <Alien scale={a.scale} hueShift={a.hueShift} />
        </group>
      ))}
    </group>
  );
}
