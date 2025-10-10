// src/hooks/useInput.js
import { useEffect, useState, useRef } from "react";

export default function useInput() {
  const [state, setState] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    jump: false,
    running: false,
  });

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  useEffect(() => {
    const isTextTarget = (el) => {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || el.isContentEditable) return true;
      // évite de capturer la barre d’espace sur des boutons
      if (tag === "button" || tag === "a") return true;
      return false;
    };

    const preventScroll = (code) =>
      code === "ArrowUp" ||
      code === "ArrowDown" ||
      code === "ArrowLeft" ||
      code === "ArrowRight" ||
      code === "Space";

    const setKey = (prev, key, value) => {
      if (prev[key] === value) return prev;      // pas de re-render inutile
      return { ...prev, [key]: value };
    };

    const mapDown = (code, prev) => {
      switch (code) {
        case "KeyZ":
        case "KeyW":
        case "ArrowUp":    return setKey(prev, "up", true);
        case "KeyS":
        case "ArrowDown":  return setKey(prev, "down", true);
        case "KeyQ":
        case "KeyA":
        case "ArrowLeft":  return setKey(prev, "left", true);
        case "KeyD":
        case "ArrowRight": return setKey(prev, "right", true);
        case "Space":      return setKey(prev, "jump", true);
        case "ShiftLeft":
        case "ShiftRight": return setKey(prev, "running", true);
        default:           return prev;
      }
    };

    const mapUp = (code, prev) => {
      switch (code) {
        case "KeyZ":
        case "KeyW":
        case "ArrowUp":    return setKey(prev, "up", false);
        case "KeyS":
        case "ArrowDown":  return setKey(prev, "down", false);
        case "KeyQ":
        case "KeyA":
        case "ArrowLeft":  return setKey(prev, "left", false);
        case "KeyD":
        case "ArrowRight": return setKey(prev, "right", false);
        case "Space":      return setKey(prev, "jump", false);
        case "ShiftLeft":
        case "ShiftRight": return setKey(prev, "running", false);
        default:           return prev;
      }
    };

    const onKeyDown = (e) => {
      // ne bloque pas la saisie dans les champs
      if (isTextTarget(e.target)) return;

      // évite le scroll pour flèches/espace
      if (preventScroll(e.code)) e.preventDefault();

      // ignore l’auto-repeat
      if (e.repeat) return;

      setState((s) => mapDown(e.code, s));
    };

    const onKeyUp = (e) => {
      if (isTextTarget(e.target)) return;
      setState((s) => mapUp(e.code, s));
    };

    // sécurité : quand l’onglet perd le focus, on relâche tout
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        setState((s) => ({
          up: false, down: false, left: false, right: false, jump: false, running: false,
        }));
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: true });
    document.addEventListener("visibilitychange", onVisibility, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return state;
}
