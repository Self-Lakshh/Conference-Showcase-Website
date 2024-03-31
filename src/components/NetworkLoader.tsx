// NetworkLoader.tsx — Premium animated splash loader with logo

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NetworkLoaderProps {
  onComplete: () => void;
}

export const NetworkLoader: React.FC<NetworkLoaderProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState(0);

  const STEPS = [
    "Assembling research constellations…",
    "Resolving citation graph nodes…",
    "Synthesising conference schedules…",
    "Connecting global innovators…",
    "Launching Conference Website…",
  ];

  /* ── Progress simulation ── */
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + Math.floor(Math.random() * 7) + 3, 100);
        setPhase(Math.min(Math.floor((next / 100) * STEPS.length), STEPS.length - 1));
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 700);
        }
        return next;
      });
    }, 140);
    return () => clearInterval(timer);
  }, [onComplete]);

  /* ── Canvas: Research node network ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    /* Hub nodes — represent research domains */
    const HUBS = [
      { label: "AI & ML",      color: "#4f6ef7", px: 0.22, py: 0.28 },
      { label: "Quantum",      color: "#7c5af5", px: 0.50, py: 0.20 },
      { label: "Biology",      color: "#06d6a0", px: 0.78, py: 0.28 },
      { label: "Cryptography", color: "#f59e0b", px: 0.18, py: 0.68 },
      { label: "Climate",      color: "#34d399", px: 0.82, py: 0.68 },
      { label: "Astrophysics", color: "#a78bfa", px: 0.50, py: 0.75 },
    ];

    type Hub = typeof HUBS[0] & { x: number; y: number; pulse: number; r: number };
    type Sat = { hub: Hub; angle: number; speed: number; dist: number; r: number };
    type Flow = { from: Hub; to: Hub; t: number; speed: number };

    let hubs: Hub[] = [];
    let sats: Sat[] = [];
    let flows: Flow[] = [];
    let t = 0;

    const build = () => {
      hubs = HUBS.map(h => ({
        ...h, x: h.px * W, y: h.py * H, pulse: Math.random() * Math.PI * 2, r: 10,
      }));
      sats = hubs.flatMap(hub =>
        Array.from({ length: 5 }, () => ({
          hub,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.004 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
          dist: 38 + Math.random() * 28,
          r: 2.5 + Math.random() * 2,
        }))
      );
      flows = [];
      for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < hubs.length; j++) {
          if (Math.random() < 0.65) {
            flows.push({ from: hubs[i], to: hubs[j], t: Math.random(), speed: 0.003 + Math.random() * 0.002 });
            flows.push({ from: hubs[j], to: hubs[i], t: Math.random(), speed: 0.003 + Math.random() * 0.002 });
          }
        }
      }
    };

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      /* Connection lines between hubs */
      for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < hubs.length; j++) {
          const a = hubs[i], b = hubs[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < W * 0.55) {
            const alpha = 0.12 * (1 - dist / (W * 0.55));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            // Bezier curve for organic feel
            const mx = (a.x + b.x) / 2 + (Math.sin(t * 0.3 + i) * 30);
            const my = (a.y + b.y) / 2 + (Math.cos(t * 0.3 + j) * 20);
            ctx.quadraticCurveTo(mx, my, b.x, b.y);
            ctx.strokeStyle = `rgba(79,110,247,${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      /* Flowing citation particles along connections */
      flows.forEach(f => {
        f.t = (f.t + f.speed) % 1;
        const x = f.from.x + (f.to.x - f.from.x) * f.t;
        const y = f.from.y + (f.to.y - f.from.y) * f.t;
        const fade = Math.sin(f.t * Math.PI);
        const rgb = hexToRgb(f.from.color);
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${0.75 * fade})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = f.from.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      /* Satellites orbiting each hub */
      sats.forEach(s => {
        s.angle += s.speed;
        const sx = s.hub.x + Math.cos(s.angle) * s.dist;
        const sy = s.hub.y + Math.sin(s.angle) * s.dist;
        const rgb = hexToRgb(s.hub.color);
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},0.55)`;
        ctx.fill();
      });

      /* Hub nodes with pulsing rings */
      hubs.forEach(h => {
        h.pulse += 0.04;
        const pulse = Math.abs(Math.sin(h.pulse));
        const rgb = hexToRgb(h.color);

        // Outer glow
        const grd = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 36);
        grd.addColorStop(0, `rgba(${rgb},0.30)`);
        grd.addColorStop(1, `rgba(${rgb},0.00)`);
        ctx.beginPath();
        ctx.arc(h.x, h.y, 36, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Pulsing ring
        ctx.beginPath();
        ctx.arc(h.x, h.y, 18 + pulse * 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb},${0.25 * (1 - pulse)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Core circle
        ctx.beginPath();
        ctx.arc(h.x, h.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},0.90)`;
        ctx.shadowBlur = 18;
        ctx.shadowColor = h.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = "bold 10px 'Inter', sans-serif";
        ctx.fillStyle = `rgba(${rgb},0.80)`;
        ctx.textAlign = "center";
        ctx.fillText(h.label, h.x, h.y + 26);
      });

      raf = requestAnimationFrame(drawFrame);
    };

    build();
    drawFrame();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      build();
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--c-bg, #09090f)" }}
    >
      {/* Canvas network */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-sm">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          {/* Glow halo */}
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-50 animate-pulse"
            style={{ background: "linear-gradient(135deg,#4f6ef7,#7c5af5)", transform: "scale(1.4)" }}
          />
          <img
            src="/logo.png"
            alt="Conference Website"
            className="relative h-20 w-20 rounded-2xl object-contain shadow-2xl"
            style={{
              background: "linear-gradient(135deg,#4f6ef7,#7c5af5)",
              padding: "14px",
            }}
          />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h1
            className="text-2xl font-heading font-extrabold tracking-tight"
            style={{ color: "var(--c-text, #f0efee)" }}
          >
            Conference Website
          </h1>
          <p
            className="text-[10px] uppercase tracking-[0.35em] mt-1 font-medium"
            style={{ color: "#4f6ef7" }}
          >
            Knowledge Discovery Portal
          </p>
        </motion.div>

        {/* Progress area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-64"
        >
          {/* Status text */}
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-xs mb-3 font-medium"
              style={{ color: "var(--c-text-2, #a1a1aa)" }}
            >
              {STEPS[phase]}
            </motion.p>
          </AnimatePresence>

          {/* Progress track */}
          <div
            className="relative h-1 w-full rounded-full overflow-hidden"
            style={{ background: "var(--c-surface-2, #1a1a24)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4f6ef7, #7c5af5, #06d6a0)",
                transition: "width 0.15s ease-out",
              }}
            />
            {/* shimmer */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                animation: "shimmer-slide 1.8s linear infinite",
              }}
            />
          </div>

          {/* Percent */}
          <div className="flex justify-end mt-1.5">
            <span className="text-[10px] font-mono font-bold" style={{ color: "#4f6ef7" }}>
              {progress}%
            </span>
          </div>
        </motion.div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer-slide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
