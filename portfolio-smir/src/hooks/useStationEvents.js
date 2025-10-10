// src/hooks/useStationEvents.js
import { useEffect, useRef, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dbg, throttleLog } from "@/utils/debug";

const OPEN_TIMEOUT_MS = 5000;

export default function useStationEvents({
  STATIONS,
  qWorldRef,
  stationDirWorld,   // ⚠️ doit être en repère MONDE (SPIN puis qWorld)
  aimToStation,
  stopAiming,
  onOpenStation,
  openThresholdRad = 0.08, // ~4.6°, très précis
  focusedIdRef,
}) {
  // Valeur par défaut (utilisée si pas de st.openRadius)
  const defaultCosOpen = Math.cos(openThresholdRad);

  const localFocusedRef = useRef(null);
  const focusRef        = focusedIdRef ?? localFocusedRef;
  const awaitingOpenRef = useRef(null);
  const justOpenedRef   = useRef(false);
  const navigatingRef   = useRef(false);

  // Dwell (latence de stabilité dans le cône)
  const insideSinceRef  = useRef(null);
  const DWELL_MS        = 140;

  // Lissage du dot
  const smoothDotRef    = useRef(null);
  const ALPHA           = 0.25; // poids du lissage

  const setNavigating = useCallback((v) => {
    navigatingRef.current = !!v;
    try { window.__saga_navigating = !!v; } catch {}
    dbg("setNavigating", { navigating: !!v });
  }, []);

  const stationsById = useMemo(() => {
    const map = new Map();
    for (const st of STATIONS) map.set(st.id, st);
    return map;
  }, [STATIONS]);

  const TMP = useMemo(() => ({
    forward: new THREE.Vector3(),
  }), []);

  const getForwardW = useCallback(() => {
    // Avant fixe du repère astronaute
    return TMP.forward.set(0, 0, 1);
  }, [TMP]);

  const clearPendingOpen = useCallback(() => {
    if (awaitingOpenRef.current) {
      dbg("clearPendingOpen", awaitingOpenRef.current);
    }
    awaitingOpenRef.current = null;
  }, []);

  const focusStation = useCallback((id, opts = {}) => {
    if (navigatingRef.current) {
      dbg("focusStation ignored: navigating");
      return;
    }

    if (!id) {
      dbg("focusStation(null) → clear + stopAiming");
      focusRef.current = null;
      clearPendingOpen();
      stopAiming?.();
      return;
    }

    if (!stationsById.has(id)) {
      dbg("focusStation ignored (unknown id)", { id });
      return;
    }

    focusRef.current = id;
    dbg("focusStation", { id, queueOpen: !!opts.queueOpen, timeout: opts.timeout });
    aimToStation(id);

    if (opts.queueOpen) {
      const timeout = typeof opts.timeout === "number" ? opts.timeout : OPEN_TIMEOUT_MS;
      awaitingOpenRef.current = { id, expiresAt: performance.now() + timeout };
      dbg("queue OPEN", awaitingOpenRef.current);
    } else if (!awaitingOpenRef.current || awaitingOpenRef.current.id !== id) {
      clearPendingOpen();
    }
  }, [aimToStation, clearPendingOpen, stationsById, stopAiming, focusRef]);

  // Listeners globaux venant de HUD/TopNav
  useEffect(() => {
    const onFocus = (event) => {
      if (navigatingRef.current) return;
      const id = event?.detail?.id;
      if (!id) return;
      dbg("listener saga-focus-station", { id });
      focusStation(id);
    };

    const onOpen = (event) => {
      if (navigatingRef.current) return;
      const id = event?.detail?.id;
      if (!id) return;
      const timeout = typeof event?.detail?.timeout === "number" ? event.detail.timeout : undefined;
      dbg("listener saga-open-station", { id, timeout });
      focusStation(id, { queueOpen: true, timeout });
    };

    window.addEventListener("saga-focus-station", onFocus);
    window.addEventListener("saga-open-station", onOpen);
    return () => {
      window.removeEventListener("saga-focus-station", onFocus);
      window.removeEventListener("saga-open-station", onOpen);
    };
  }, [focusStation]);

  const logDot = useMemo(
    () => throttleLog((payload) => dbg("align check", payload), 160),
    []
  );

  useFrame(() => {
    if (navigatingRef.current) return;

    const pending = awaitingOpenRef.current;
    if (!pending) return;

    const now = performance.now();
    if (now > pending.expiresAt) {
      dbg("pending OPEN expired", pending);
      clearPendingOpen();
      return;
    }

    const focusedId = focusRef.current;
    if (!focusedId || focusedId !== pending.id) {
      dbg("pending OPEN cleared (focus changed)", { pending, focusedId });
      clearPendingOpen();
      return;
    }

    const st = stationsById.get(focusedId);
    if (!st) {
      dbg("pending OPEN cleared (station missing)", { focusedId });
      clearPendingOpen();
      return;
    }

    const forwardW = getForwardW();
    const dirW = stationDirWorld(st.pos);
    const rawDot = Math.max(-1, Math.min(1, forwardW.dot(dirW)));

    // Lissage EMA
    if (smoothDotRef.current == null) smoothDotRef.current = rawDot;
    smoothDotRef.current = smoothDotRef.current + ALPHA * (rawDot - smoothDotRef.current);
    const dot = smoothDotRef.current;

    const cosLocal = Math.cos(st.openRadius ?? openThresholdRad);
    logDot({ id: focusedId, dot: +dot.toFixed(3), need: +cosLocal.toFixed(3) });

    // Condition d'ouverture avec latence (DWELL)
    if (dot >= cosLocal) {
      if (insideSinceRef.current == null) insideSinceRef.current = now;
      if (now - insideSinceRef.current < DWELL_MS) return; // attendre stabilité

      if (justOpenedRef.current) {
        dbg("open blocked: justOpenedRef already true");
        clearPendingOpen();
        return;
      }

      justOpenedRef.current = true;
      insideSinceRef.current = null;
      clearPendingOpen();
      stopAiming?.();
      setNavigating(true);

      dbg("OPEN NOW → onOpenStation()", { id: focusedId, dot });

      try {
        onOpenStation?.(focusedId);
        dbg("onOpenStation returned");
      } catch (err) {
        dbg("onOpenStation threw", err);
      } finally {
        try {
          window.dispatchEvent(
            new CustomEvent("saga-station-opened", { detail: { id: focusedId } })
          );
          dbg("DISPATCH saga-station-opened", { id: focusedId });
        } catch (e) {
          dbg("dispatch saga-station-opened failed", e);
        }
        setTimeout(() => {
          setNavigating(false);
          justOpenedRef.current = false;
          dbg("navigation reset");
        }, 1000);
      }
    } else {
      // Sorti du cône → reset latence
      if (insideSinceRef.current != null) insideSinceRef.current = null;
    }
  });

  return { focusStation };
}
