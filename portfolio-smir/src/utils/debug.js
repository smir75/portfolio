// src/utils/debug.js
export const DEBUG_OPEN_FLOW = true;  // ← coupe/active tous les logs d’ouverture ici

let last = 0;
export function dbg(...args) {
  if (!DEBUG_OPEN_FLOW) return;
  // petit timestamp relatif pour suivre l’ordre
  const now = performance.now();
  const dt = (now - last) | 0;
  last = now;
  // style pour repérer vite
  // eslint-disable-next-line no-console
  console.log(
    "%c[OPENFLOW]%c +" + dt + "ms",
    "background:#1e293b;color:#93c5fd;padding:2px 6px;border-radius:4px",
    "color:#94a3b8",
    ...args
  );
}

// un helper pour throttle des logs en boucle
export function throttleLog(fn, everyMs = 200) {
  let lastT = 0;
  return (...args) => {
    const now = performance.now();
    if (now - lastT >= everyMs) {
      lastT = now;
      fn(...args);
    }
  };
}
