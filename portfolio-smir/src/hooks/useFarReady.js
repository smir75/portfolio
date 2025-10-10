// src/hooks/useFarReady.js
import { useEffect, useState } from "react";

/** Retourne true après le 1er RAF — permet de charger les éléments lointains sans jank. */
export default function useFarReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return ready;
}