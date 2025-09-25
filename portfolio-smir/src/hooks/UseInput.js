// src/hooks/useInput.js
import { useEffect, useState, useRef } from "react";

/**
 * Hook d'input clavier unifié :
 * - ZQSD / WASD / Flèches pour le déplacement
 * - Espace = jump
 * - Shift = running
 * Notes :
 * - On empêche le scroll de la page pour Arrow/Espace
 * - On gère finement ShiftLeft/ShiftRight
 */
export default function useInput() {
  const [state, setState] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
    running: false,
  });

  // Pour éviter re-creations dans les handlers
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const preventScroll = (code) =>
      code === "ArrowUp" ||
      code === "ArrowDown" ||
      code === "ArrowLeft" ||
      code === "ArrowRight" ||
      code === "Space";

    const onKeyDown = (e) => {
      const { code } = e;
      if (preventScroll(code)) e.preventDefault();

      setState((s) => {
        // mapping AZERTY / QWERTY / Flèches
        const next = { ...s };
        if (code === "KeyZ" || code === "KeyW" || code === "ArrowUp") next.up = true;
        if (code === "KeyS" || code === "ArrowDown") next.down = true;
        if (code === "KeyQ" || code === "KeyA" || code === "ArrowLeft") next.left = true;
        if (code === "KeyD" || code === "ArrowRight") next.right = true;
        if (code === "Space") next.jump = true;
        if (code === "ShiftLeft" || code === "ShiftRight") next.running = true;
        return next;
      });
    };

    const onKeyUp = (e) => {
      const { code } = e;
      setState((s) => {
        const next = { ...s };
        if (code === "KeyZ" || code === "KeyW" || code === "ArrowUp") next.up = false;
        if (code === "KeyS" || code === "ArrowDown") next.down = false;
        if (code === "KeyQ" || code === "KeyA" || code === "ArrowLeft") next.left = false;
        if (code === "KeyD" || code === "ArrowRight") next.right = false;
        if (code === "Space") next.jump = false;
        if (code === "ShiftLeft" || code === "ShiftRight") next.running = false;
        return next;
      });
    };

    // Écoute globale (zones UI au-dessus du canvas incluses)
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return state;
}
