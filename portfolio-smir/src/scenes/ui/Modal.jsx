import React from "react";
import { Html } from "@react-three/drei";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
+    <Html fullscreen>
+      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[2000]">
+        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg p-4 border rounded-2xl border-slate-700 bg-slate-900 text-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="px-2 py-1 border rounded-lg border-slate-600 bg-slate-800">✕</button>
          </div>
          <div className="text-slate-300">{children}</div>
        </div>
      </div>
    </Html>
  );
}
