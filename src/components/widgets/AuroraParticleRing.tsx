
import { useEffect, useRef } from "react";

type Props = {
  isLive: boolean;
};

type Particle = {
  angle: number;
  radius: number;
  speed: number;
  phase: number;
  scatter: number;
  burstDirection: number;
  burstStrength: number;
};

const SIZE = 180;
const COUNT = 4500;
const TAU = Math.PI * 2;

export default function AuroraParticleRing({ isLive }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef(isLive);

  useEffect(() => {
    liveRef.current = isLive;
  }, [isLive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const random = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const particles: Particle[] = Array.from(
      { length: COUNT },
      () => ({
        angle: random(0, TAU),
        radius: random(0, 1),
        speed: random(0.65, 1.25),
        phase: random(0, TAU),
        scatter: random(0.3, 1),
        burstDirection: random(-1, 1),
        burstStrength: random(0.1, 1),
      })
    );

    let lastTime = 0;
    let elapsed = 0;
    let liveAmount = isLive ? 1 : 0;
    let animationId = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function render(time: number) {
      if (!ctx) return;

      const dt = lastTime
        ? Math.min((time - lastTime) / 1000, 0.05)
        : 0;

      lastTime = time;
      elapsed += dt;

      liveAmount +=
        ((liveRef.current ? 1 : 0) - liveAmount) *
        Math.min(1, dt * 2);

      ctx.clearRect(0, 0, SIZE, SIZE);

      const center = SIZE / 2;

      // 不規則な強弱を作る
      const turbulence = reducedMotion
        ? 0
        : (
            Math.sin(elapsed * 1.7) * 0.35 +
            Math.sin(elapsed * 2.9 + 1.8) * 0.25 +
            Math.sin(elapsed * 0.73 + 0.6) * 0.4
          );

      const pulse =
        liveAmount * Math.max(0, turbulence);

      // 通常時は白、LIVE中は金色
      const r = 255;
      const g = Math.round(255 - 68 * liveAmount);
      const b = Math.round(255 - 195 * liveAmount);

     ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

// LIVE中だけ金色の光を追加
if (liveAmount > 0.01) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.filter = `blur(5px)`;

  ctx.globalAlpha = liveAmount * 0.65;

  ctx.drawImage(ctx.canvas, 0, 0, SIZE, SIZE);

  ctx.restore();
}
      for (const p of particles) {
        // 外周ほど粒子が密集
        const density = Math.pow(p.radius, 0.55);
        

        // 海流のように静かに回転
        const angle =
          p.angle +
          elapsed * 0.12 * p.speed +
          Math.sin(elapsed * 0.25 + p.phase) * 0.035;

        // 正円のリング
        const baseRadius = 33 + density * 39;

        // 緩やかな揺らぎ
        const wave =
          Math.sin(angle * 3 + elapsed * 0.4 + p.phase) *
          2.5;

        // 粒子ごとに異なる方向・強さで拡散
        const localWave =
          Math.sin(angle * 5 + elapsed * 1.3 + p.phase);

        const burst =
          pulse *
          localWave *
          p.burstDirection *
          p.burstStrength *
          28;

        const radius = baseRadius + wave + burst;

        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;

        // 全粒子を同じサイズ・同じ明るさで描画
        ctx.fillRect(x, y, 0.65, 0.65);
      }

      if (!reducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    }

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="aurora-particle-canvas"
      aria-hidden="true"
    />
  );
}
