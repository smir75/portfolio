// src/scenes/belt/AsteroidBelt.jsx
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mulberry32 } from "@/utils/rng";

export default function AsteroidBelt({
  RADIUS,
  count = 900,
  inner = 3.2,
  outer = 4.8,
  centerOffset = 0.0, // 0 = centré sur l'origine (visible tout de suite)
  tilt = 0.45,
  reduceMotion = false,
  seed = 1337,
}) {
  const rng = useMemo(() => mulberry32(seed), [seed]);

  // 3 géométries “roches glacées”
  const baseGeos = useMemo(() => {
    const makeRock = (subdiv = 1, noiseAmp = 0.22, ridged = 0.35) => {
      const g = new THREE.IcosahedronGeometry(1, subdiv);
      const p = g.attributes.position;
      const n = new THREE.Vector3();
      const dirs = Array.from({ length: 4 }, () => new THREE.Vector3().randomDirection());
      for (let i = 0; i < p.count; i++) {
        n.fromBufferAttribute(p, i).normalize();
        let h = 0;
        for (let k = 0; k < dirs.length; k++) {
          const d = Math.abs(n.dot(dirs[k]));
          h += Math.pow(1 - d, 1.15 + k * 0.22) * (k === 0 ? 1 : ridged / (k + 1));
        }
        h = (h / dirs.length) * noiseAmp;
        const s = 1 + h + (rng() - 0.5) * 0.03;
        p.setXYZ(i, p.getX(i) * s, p.getY(i) * s, p.getZ(i) * s);
      }
      g.computeVertexNormals();
      return g;
    };
    return [makeRock(0, 0.20, 0.32), makeRock(1, 0.18, 0.36), makeRock(2, 0.16, 0.40)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]); // rng changeant rendrait les géos non-déter; on fixe au seed

  // ✅ cleanup des géos à l’unmount
  useEffect(() => {
    return () => {
      baseGeos.forEach((g) => g.dispose());
    };
  }, [baseGeos]);

  // palette glacée
  const palette = useMemo(
    () => [
      new THREE.Color("#b8c4cf"),
      new THREE.Color("#aab9c6"),
      new THREE.Color("#cfd9e1"),
    ],
    []
  );

  // ✅ Génère *au render* les paramètres + *le bon nombre d’instances* par géo
  const geoParams = useMemo(() => {
    const res = baseGeos.map(() => []);
    const base = Math.floor(count / baseGeos.length);
    const rem = count % baseGeos.length;

    baseGeos.forEach((_, gi) => {
      const n = base + (gi < rem ? 1 : 0);
      const arr = res[gi];

      for (let i = 0; i < n; i++) {
        const rAbs = THREE.MathUtils.lerp(inner * RADIUS, outer * RADIUS, rng());
        const theta0 = rng() * Math.PI * 2;
        const ecc = (rng() - 0.5) * 0.006;
        const yAmp = (outer - inner) * RADIUS * 0.06;

        // loi de puissance pour la taille
        const sMin = 0.22, sMax = 1.0;
        const exponent = 2.2;
        const u = rng();
        const scale = sMin + (sMax - sMin) * (1 - Math.pow(u, 1 / exponent));

        const speed = 0.02 + rng() * 0.04;
        const tumble = new THREE.Vector3(
          (rng() - 0.5) * 1.2,
          (rng() - 0.5) * 1.2,
          (rng() - 0.5) * 1.2
        );

        const col = palette[gi % palette.length].clone();
        const lightJitter = (rng() - 0.5) * 0.10;
        col.offsetHSL(0, 0, lightJitter);

        arr.push({
          rAbs, theta0, ecc, yAmp, scale, speed, tumble, color: col, phase: rng() * Math.PI * 2,
        });
      }
    });

    return res; // Array<Array<Param>>
  }, [baseGeos, count, inner, outer, RADIUS, rng, palette]);

  const meshes = useRef([]);
  const dummyRefs = useRef(baseGeos.map(() => new THREE.Object3D()));

  // ✅ Pose les couleurs d’instance + matrices initiales (t=0) dès que les refs existent
  useEffect(() => {
    const slow = reduceMotion ? 0.4 : 1.0;

    baseGeos.forEach((_, gi) => {
      const mesh = meshes.current[gi];
      const arr = geoParams[gi];
      if (!mesh || !arr) return;
      if (mesh.instanceMatrix?.setUsage) {
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        }

      // couleurs
      for (let i = 0; i < arr.length; i++) mesh.setColorAt(i, arr[i].color);
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      // matrices t=0
      const dummy = dummyRefs.current[gi];
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        const a = p.theta0 + 0 * p.speed * slow;

        const rNow = p.rAbs * (1 + p.ecc * Math.cos(a));
        const x = rNow * Math.cos(a);
        const z = rNow * Math.sin(a);
        const y = Math.sin(a * 3.0 + p.phase) * p.yAmp;

        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  }, [baseGeos, geoParams, reduceMotion]);

  // Animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const slow = reduceMotion ? 0.4 : 1.0;

    baseGeos.forEach((_, gi) => {
      const mesh = meshes.current[gi];
      if (!mesh) return;
      const arr = geoParams[gi];
      const dummy = dummyRefs.current[gi];

      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        const a = p.theta0 + t * p.speed * slow;

        const rNow = p.rAbs * (1 + p.ecc * Math.cos(a));
        const x = rNow * Math.cos(a);
        const z = rNow * Math.sin(a);
        const y = Math.sin(a * 3.0 + p.phase) * p.yAmp;

        dummy.position.set(x, y, z);
        // rotation déterministe (pas de cumul dans la boucle)
        dummy.rotation.set(
          t * p.tumble.x * slow,
          t * p.tumble.y * slow,
          t * p.tumble.z * slow
        );
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group rotation={[tilt, 0, 0]} position={[0, 0, -centerOffset * RADIUS]}>
      {baseGeos.map((g, gi) => {
        const n = geoParams[gi]?.length ?? 1; 
        return (
          <instancedMesh
            key={`belt-${gi}-${n}`}
            ref={(el) => (meshes.current[gi] = el)}
            args={[g, undefined, n]}
            frustumCulled={false}
          >
            <meshStandardMaterial
              attach="material"
              roughness={0.92}
              metalness={0.06}
              vertexColors
            />
          </instancedMesh>
        );
      })}
    </group>
  );
}
