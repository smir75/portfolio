// src/hooks/useStationAiming.js
import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Aligne qWorldRef pour amener la station (après SPIN) devant l'astronaute (+Z).
 * - On fige qTarget AU DEMARRAGE de l'aiming (pas de recalcul à chaque frame).
 * - Gestion du cas quasi opposé (dot ≈ -1) avec un yaw pur pour éviter les flips.
 */
export default function useStationAiming({
  STATIONS,
  qWorldRef,
  spinYRef,
  maxAlignSpeed = 0.80, // rad/s
  alignEps = 0.0015,    // rad (~0.086°)
}) {
  const aimingStationIdRef = useRef(null);
  const qTargetRef = useRef(null);

  const TMP = useMemo(() => ({
    Y_AXIS: new THREE.Vector3(0, 1, 0),
    TARGET_AXIS: new THREE.Vector3(0, 0, 1),
    qSpin: new THREE.Quaternion(),
    qDelta: new THREE.Quaternion(),
    qTmp: new THREE.Quaternion(),
    dirSpin: new THREE.Vector3(),
    lastLogTs: 0,
  }), []);

  // --- calc cible une seule fois au START
  function computeFrozenTarget(st) {
    // 1) direction station après SPIN (repère MONDE visuel, sans qWorld)
    const qSpin = TMP.qSpin.setFromAxisAngle(TMP.Y_AXIS, spinYRef?.current || 0);
    const dirSpin = TMP.dirSpin
      .copy(st.pos)
      .normalize()
      .applyQuaternion(qSpin)   // -> monde après spin
      .normalize();

    // 2) cas presque opposé : définir un yaw pur pour éviter l'axe instable
    const dot = THREE.MathUtils.clamp(dirSpin.dot(TMP.TARGET_AXIS), -1, 1);
    if (dot < -0.9995) {
      // Yaw actuel de la station (par rapport à Z+)
      const yawNow = Math.atan2(dirSpin.x, dirSpin.z); // [-π, π]
      const deltaYaw = -yawNow; // amener sur yaw 0 (Z+)
      TMP.qDelta.setFromAxisAngle(TMP.Y_AXIS, deltaYaw);
      // qTarget absolu = rotation qui met +Z vers dirSpin mais via yaw pur
      return TMP.qTmp.copy(TMP.qDelta); // absolu
    }

    // 3) cas normal : map +Z -> dirSpin (chemin le plus court)
    TMP.qDelta.setFromUnitVectors(dirSpin, TMP.TARGET_AXIS);
    return TMP.qTmp.copy(TMP.qDelta); // absolu
  }

  // API: démarrer l'alignement vers une station
  const aimToStation = useCallback((id) => {
    const st = STATIONS.find((s) => s.id === id);
    if (!st) {
      console.warn(`[aimToStation] Station "${id}" not found`);
      return;
    }
    aimingStationIdRef.current = id;
    qTargetRef.current = computeFrozenTarget(st);

    // Log angle initial (forwardW vs dirSpin après SPIN)
    const qSpin = TMP.qSpin.setFromAxisAngle(TMP.Y_AXIS, spinYRef?.current || 0);
    const forwardW = TMP.TARGET_AXIS.clone().applyQuaternion(qWorldRef.current).normalize();
    const dirSpin = TMP.dirSpin.copy(st.pos).normalize().applyQuaternion(qSpin).normalize();
    const dot = THREE.MathUtils.clamp(forwardW.dot(dirSpin), -1, 1);
    const angDeg = THREE.MathUtils.radToDeg(Math.acos(dot)).toFixed(1);
    console.log(`[AIMING] Start → ${id} (angle=${angDeg}°)`);
  }, [STATIONS, qWorldRef, spinYRef]);

  // API: stopper l'alignement
  const stopAiming = useCallback(() => {
    aimingStationIdRef.current = null;
    qTargetRef.current = null;
  }, []);

  // Helper: direction MONDE de la station (utilisé par useStationEvents)
  // On laisse comme tu avais : SPIN puis qWorld, afin de rester dans le même repère que forwardW;
  // (le dot est invariant de toute façon si on applique la même rotation aux deux)
  const stationDirWorld = useCallback((posLocal) => {
    const qSpin = TMP.qSpin.setFromAxisAngle(TMP.Y_AXIS, spinYRef?.current || 0);
    return TMP.dirSpin
      .copy(posLocal)
      .normalize()
      .applyQuaternion(qSpin)
      .applyQuaternion(qWorldRef.current)
      .normalize();
  }, [TMP, spinYRef, qWorldRef]);

  // --- Boucle d'alignement (slerp vers qTargetRef figé)
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt || 0.016, 1/60);
    const id = aimingStationIdRef.current;
    const qTarget = qTargetRef.current;
    if (!id || !qTarget) return;

    const st = STATIONS.find((s) => s.id === id);
    if (!st) {
      aimingStationIdRef.current = null;
      qTargetRef.current = null;
      return;
    }

    const qWorld = qWorldRef.current;

    // angle relatif entre qWorld et qTarget
    const dotQT = THREE.MathUtils.clamp(Math.abs(qWorld.dot(qTarget)), -1, 1);
    const angle = 2 * Math.acos(dotQT);

    if (angle < alignEps) {
      qWorld.copy(qTarget);
      aimingStationIdRef.current = null;
      qTargetRef.current = null;
      console.log(`[AIMING] Done → ${id}`);
      return;
    }

    // step borné par maxAlignSpeed (rad/s)
    const maxStep = Math.min(0.999, (maxAlignSpeed * dt) / Math.max(angle, 1e-6));
    qWorld.slerp(qTarget, maxStep);

    // --- Logs throttle : angle visuel restant (forwardW vs dirSpin après SPIN)
    const now = performance.now();
    if (now - TMP.lastLogTs > 300) {
      TMP.lastLogTs = now;

      const qSpin = TMP.qSpin.setFromAxisAngle(TMP.Y_AXIS, spinYRef?.current || 0);
      const forwardLocal = TMP.TARGET_AXIS; // (0,0,1)
      const dirView = TMP.dirSpin.copy(st.pos).normalize().applyQuaternion(qSpin).applyQuaternion(qWorld).normalize();

      const dot = THREE.MathUtils.clamp(forwardLocal.dot(dirView), -1, 1);
      const angDeg = THREE.MathUtils.radToDeg(Math.acos(dot));
      console.log(`[AIMING] ${id}: angle=${angDeg.toFixed(1)}° step=${(maxStep*100).toFixed(1)}%`);
    }
  });

  return {
    aimToStation,
    stopAiming,
    stationDirWorld,
  };
}
