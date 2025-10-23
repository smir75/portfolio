import React, { useState } from "react";
import CodeRain from "./CodeRain";

const CODE_RAIN_SOURCE = `import React, { useEffect, useRef } from "react";

export default function CodeRain({ density = 20, speed = 1.1, charSize = 16, color = "#35ff88", glow = true }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const colsRef = useRef([]);
  const devicePixelRatioRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let width = canvas.clientWidth || 600;
    let height = canvas.clientHeight || 400;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    devicePixelRatioRef.current = dpr;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);

    const cols = Math.max(10, Math.floor((width / 1000) * density));
    const columnWidth = Math.max(10, Math.floor(width / cols));
    const columnCount = Math.floor(width / columnWidth);
    const drops = new Array(columnCount).fill(0).map(() => Math.floor(Math.random() * height));
    colsRef.current = { columnWidth, columnCount, drops, width, height };

    ctx.font = \`\${charSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace\`;
    ctx.textBaseline = "top";
    ctx.shadowColor = glow ? color : "transparent";
    ctx.shadowBlur = glow ? 8 : 0;

    const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function step() {
      rafRef.current = requestAnimationFrame(step);
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = color;

      for (let i = 0; i < colsRef.current.columnCount; i++) {
        const x = i * colsRef.current.columnWidth;
        const y = colsRef.current.drops[i] * (charSize + 2);
        const char = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        ctx.fillText(char, x, y);
        colsRef.current.drops[i] += speed;
        if (y > height && Math.random() > 0.975) colsRef.current.drops[i] = 0;
      }
    }

    step();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        width = Math.max(1, cr.width);
        height = Math.max(1, cr.height);
        const dpr2 = devicePixelRatioRef.current;
        canvas.width = Math.floor(width * dpr2);
        canvas.height = Math.floor(height * dpr2);
        ctx.setTransform(dpr2, 0, 0, dpr2, 0, 0);
        const newCols = Math.max(10, Math.floor((width / 1000) * density));
        const columnWidth = Math.max(10, Math.floor(width / newCols));
        const columnCount = Math.floor(width / columnWidth);
        const drops = new Array(columnCount).fill(0).map(() => Math.floor(Math.random() * height));
        colsRef.current = { columnWidth, columnCount, drops, width, height };
        ctx.font = \`\${charSize}px ui-monospace, Menlo, Monaco, Consolas, "Courier New", monospace\`;
      }
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [density, speed, charSize, color, glow]);

  return <canvas ref={canvasRef} className="w-full h-full rounded-2xl" aria-hidden="true" />;
}
`;

export default function CodeFlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      {flipped && (
        <div
          className="fixed inset-0 z-[9]"
          onClick={() => setFlipped(false)}
          aria-hidden
        />
      )}

      <div className="relative z-10">
        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className="absolute top-3 right-3 z-20 rounded-xl px-3 py-1.5 text-[12px] font-semibold bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm transition"
        >
          {flipped ? "↩︎ Retour" : "</> Code"}
        </button>

        <div
          className="relative w-full h-[460px] md:h-[560px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
          style={{ perspective: "1200px" }}
        >
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              <div className="w-full h-full bg-[#0b1327]">
                <CodeRain density={26} speed={1.15} charSize={16} color="#32f58a" />
              </div>
            </div>

            <div
              className="absolute inset-0"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className={`w-full h-full bg-black/95 text-[#32f58a] flex flex-col ${flipped ? "" : "pointer-events-none"}`}>
                <div className="flex items-center gap-2 px-3 py-2 border-b border-[#32f58a22] text-[12px] tracking-wide">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                  <span className="ml-2 opacity-80">terminal — smir@portfolio</span>
                </div>
                <pre className={`flex-1 p-4 font-mono text-[13.5px] leading-relaxed whitespace-pre ${flipped ? "overflow-auto" : "overflow-hidden"}`}>
{CODE_RAIN_SOURCE}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
