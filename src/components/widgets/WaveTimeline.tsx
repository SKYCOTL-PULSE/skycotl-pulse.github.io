import { useEffect, useRef, useState } from "react";
import "./WaveTimeline.css";

const phases = [
  { label: "朝", en: "Morning", start: 0, end: 10 },
  { label: "霧", en: "Fog", start: 10, end: 15 },
  { label: "昼", en: "Day", start: 15, end: 40 },
  { label: "夕方", en: "Evening", start: 40, end: 50 },
  { label: "夜", en: "Night", start: 50, end: 60 },
];

const PATH =
  "M 40 120 C 220 120, 300 45, 500 45 C 700 45, 780 120, 960 120";

const ARLES_CYCLE_SECONDS = 12 * 60;
const ARLES_PHASE_SECONDS = 3 * 60;

// アルルの巣の各フェーズを、既存グラフの位置に対応させる
const arlesPhases = [
  { label: "朝", en: "Morning", start: 0, end: 3, graphStart: 0, graphEnd: 10 },
  { label: "昼", en: "Day", start: 3, end: 6, graphStart: 15, graphEnd: 40 },
  { label: "夕方", en: "Evening", start: 6, end: 9, graphStart: 40, graphEnd: 50 },
  { label: "夜", en: "Night", start: 9, end: 12, graphStart: 50, graphEnd: 60 },
];

function formatRemaining(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
}

type Point = {
  x: number;
  y: number;
};

export default function WaveTimeline() {
  const pathRef = useRef<SVGPathElement | null>(null);

  const [now, setNow] = useState(new Date());

  const [aviaryDot, setAviaryDot] = useState<Point>({
    x: 40,
    y: 120,
  });

  const [arlesDot, setArlesDot] = useState<Point>({
    x: 40,
    y: 120,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minute = now.getMinutes();
  const second = now.getSeconds();

  const totalSeconds = minute * 60 + second;

  // -----------------------------
  // 花鳥郷：60分周期
  // -----------------------------

  const aviaryProgress = totalSeconds / 3600;

  const currentPhase =
    phases.find(
      (phase) => minute >= phase.start && minute < phase.end
    ) ?? phases[0];

  const currentIndex = phases.findIndex(
    (phase) => phase.label === currentPhase.label
  );

  const nextPhase = phases[(currentIndex + 1) % phases.length];

  const remainingSeconds =
    currentPhase.end * 60 - totalSeconds;

  // -----------------------------
  // アルルの巣：12分周期短すぎる
  // -----------------------------

  const arlesCycleSeconds =
    totalSeconds % ARLES_CYCLE_SECONDS;

  const arlesPhaseIndex = Math.floor(
    arlesCycleSeconds / ARLES_PHASE_SECONDS
  );

  const arlesPhase = arlesPhases[arlesPhaseIndex];

  const arlesNextPhase =
    arlesPhases[(arlesPhaseIndex + 1) % arlesPhases.length];

  const arlesPhaseProgress =
    (arlesCycleSeconds % ARLES_PHASE_SECONDS) /
    ARLES_PHASE_SECONDS;

  const arlesRemainingSeconds =
    ARLES_PHASE_SECONDS -
    (arlesCycleSeconds % ARLES_PHASE_SECONDS);

  // 現在フェーズ内での位置を計算
  const arlesGraphMinute =
    arlesPhase.graphStart +
    (arlesPhase.graphEnd - arlesPhase.graphStart) *
      arlesPhaseProgress;

  const arlesProgress = arlesGraphMinute / 60;

// 朝→昼の切り替わりで霧をスキップ
// 切り替わり前後の1秒間でフェードさせる
const FADE_SECONDS = 2;

const secondsInPhase =
  arlesCycleSeconds % ARLES_PHASE_SECONDS;

let arlesOpacity = 1;

// 朝の終了直前
if (arlesPhaseIndex === 0) {
  const secondsUntilDay =
    ARLES_PHASE_SECONDS - secondsInPhase;

  if (secondsUntilDay <= FADE_SECONDS) {
    arlesOpacity = secondsUntilDay / FADE_SECONDS;
  }
}

// 昼の開始直後
if (arlesPhaseIndex === 1) {
  if (secondsInPhase < FADE_SECONDS) {
    arlesOpacity = secondsInPhase / FADE_SECONDS;
  }
}

  if (arlesPhaseIndex === 1) {
    const secondsSinceDay =
      arlesCycleSeconds % ARLES_PHASE_SECONDS;

    if (secondsSinceDay < FADE_SECONDS) {
      arlesOpacity = secondsSinceDay / FADE_SECONDS;
    }
  }

  // -----------------------------
  // SVG上の座標を取得 (safariとかのためにuseEffectでやる)
  // -----------------------------

  useEffect(() => {
    const path = pathRef.current;

    if (!path) return;

    const length = path.getTotalLength();

    const aviaryPoint = path.getPointAtLength(
      length * aviaryProgress
    );

    const arlesPoint = path.getPointAtLength(
      length * arlesProgress
    );

    setAviaryDot({
      x: aviaryPoint.x,
      y: aviaryPoint.y,
    });

    setArlesDot({
      x: arlesPoint.x,
      y: arlesPoint.y,
    });
  }, [aviaryProgress, arlesProgress]);

  return (
    <div className="wave-timeline">

      {/* 凡例 */}
      <div className="wave-legends">
        <div className="wave-legend">
          <span
            className="wave-legend-dot"
            style={{ background: "#FFD66B" }}
          />
          花鳥郷 / Aviary Village
        </div>

        <div className="wave-legend">
          <span
            className="wave-legend-dot"
            style={{ background: "#65C7FF" }}
          />
          アルルの巣 / Arles Nest
        </div>
      </div>

      <svg
        width="100%"
        height="130"
        viewBox="0 0 1000 150"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 縦線 */}
        {phases.map((phase) => {
          const x = 40 + (phase.start / 60) * 920;

          return (
            <line
              key={phase.label}
              x1={x}
              y1={34}
              x2={x}
              y2={120}
              stroke="rgba(255,255,255,.1)"
              strokeWidth="2"
            />
          );
        })}

        {/* フェーズ名 */}
        {phases.map((phase) => {
          const x = 40 + (phase.start / 60) * 920;

          const active =
            currentPhase.label === phase.label ||
            arlesPhase.label === phase.label;

          return (
            <g key={phase.label}>
              <text
                x={x}
                y={24}
                textAnchor="middle"
                fontSize="24"
                fontWeight="700"
                fill={
                  active
                    ? "#ffffff"
                    : "rgba(255,255,255,.45)"
                }
              >
                {phase.label}
              </text>

              <text
                x={x}
                y={160}
                textAnchor="middle"
                fontSize="12"
                fontWeight="500"
                fill="rgba(255,255,255,.45)"
              >
                {phase.en}
              </text>
            </g>
          );
        })}

        {/* 共通の曲線 */}
        <path
          ref={pathRef}
          d={PATH}
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* 花鳥郷：黄色 */}
        <circle
          cx={aviaryDot.x}
          cy={aviaryDot.y}
          r="12"
          fill="#FFD66B"
          filter="drop-shadow(0 0 10px #FFD66B)"
        />

        {/* アルルの巣：青色 */}
        <circle
          cx={arlesDot.x}
          cy={arlesDot.y}
          r="10"
          fill="#65C7FF"
          opacity={arlesOpacity}
          filter="drop-shadow(0 0 10px #65C7FF)"
        />
      </svg>

{/* 次回環境変化 */}
<div className="wave-next">
  <div>
    <span style={{ color: "#FFD66B" }}>●</span>
    {" "}NEXT {nextPhase.label} / {nextPhase.en}{" "}
    {formatRemaining(remainingSeconds)}
  </div>

  <div>
    <span style={{ color: "#65C7FF" }}>●</span>
    {" "}NEXT {arlesNextPhase.label} / {arlesNextPhase.en}{" "}
    {formatRemaining(arlesRemainingSeconds)}
  </div>
</div>
    </div>
  );
}