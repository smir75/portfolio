import { useEffect, useState } from "react";
export default function useInput() {
  const [i, set] = useState({ up:false, down:false, left:false, right:false, jump:false });
  useEffect(() => {
    const down = (e) => {
      if (["ArrowUp","KeyW"].includes(e.code)) set(s=>({...s,up:true}));
      if (["ArrowDown","KeyS"].includes(e.code)) set(s=>({...s,down:true}));
      if (["ArrowLeft","KeyA"].includes(e.code)) set(s=>({...s,left:true}));
      if (["ArrowRight","KeyD"].includes(e.code)) set(s=>({...s,right:true}));
      if (e.code === "Space") set(s=>({...s,jump:true}));
    };
    const up = (e) => {
      if (["ArrowUp","KeyW"].includes(e.code)) set(s=>({...s,up:false}));
      if (["ArrowDown","KeyS"].includes(e.code)) set(s=>({...s,down:false}));
      if (["ArrowLeft","KeyA"].includes(e.code)) set(s=>({...s,left:false}));
      if (["ArrowRight","KeyD"].includes(e.code)) set(s=>({...s,right:false}));
      if (e.code === "Space") set(s=>({...s,jump:false}));
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);
  return i;
}
