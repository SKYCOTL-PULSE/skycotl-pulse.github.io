
import type { SkyEvent } from "../../data/events";
import { events } from "../../data/events";
import {
  getNextEventTime,
  getPreviousEventTime,
  isEventActive,
} from "../../utils/schedule";

import "./LandscapeClock.css";

type Props = {
  now: Date;
};

// NONEのドット文字
const dotLetters: Record<string, string[]> = {
  N: [
    "10001", "11001", "10101", "10011",
    "10001", "10001", "10001",
  ],
  O: [
    "01110", "10001", "10001", "10001",
    "10001", "10001", "01110",
  ],
  E: [
    "11111", "10000", "10000", "11110",
    "10000", "10000", "11111",
  ],
};

const aviaryPhases = [
  { en: "morning", start: 0, end: 10 },
  { en: "fog", start: 10, end: 15 },
  { en: "day", start: 15, end: 40 },
  { en: "evening", start: 40, end: 50 },
  { en: "night", start: 50, end: 60 },
];

const arlesPhases = [
  "morning",
  "day",
  "evening",
  "night",
];

function getLandscapeStatuses(now: Date) {
  const minute = now.getMinutes();
  const totalSeconds =
    minute * 60 + now.getSeconds();

  const aviary =
    aviaryPhases.find(
      (phase) =>
        minute >= phase.start &&
        minute < phase.end
    )?.en ?? "morning";

  const arlesIndex = Math.floor(
    (totalSeconds % 720) / 180
  );

  const arles = arlesPhases[arlesIndex];

  // 現在のAuroraWidgetと同じ夏時間設定
  const isSummerTime = true;

  const auroraHours = isSummerTime
    ? [16, 18, 20, 22, 0, 2, 4, 6, 8, 10, 12, 14]
    : [17, 19, 21, 23, 1, 3, 6, 7, 9, 11, 13, 15];

  const auroraLive = auroraHours.some((hour) => {
    const start = new Date(now);
    start.setHours(hour, 0, 0, 0);

    const elapsed = now.getTime() - start.getTime();

    return elapsed >= 0 && elapsed < 3600000;
  });

  return {
    aviary,
    arles,
    aurora: auroraLive ? "on air" : "off air",
  };
}

function DotNone() {
  return (
    <svg
      className="landscape-none"
      viewBox="0 0 120 40"
      role="img"
      aria-label="NONE"
    >
      {"NONE".split("").map((letter, index) =>
        dotLetters[letter].flatMap((row, y) =>
          row.split("").map((pixel, x) =>
            pixel === "1" ? (
              <circle
                key={`${index}-${x}-${y}`}
                cx={8 + index * 29 + x * 4.5}
                cy={5 + y * 4.5}
                r="1.35"
                fill="white"
              />
            ) : null
          )
        )
      )}
    </svg>
  );
}

export default function LandscapeClock({ now }: Props) {
  const scheduledEvents = events.filter(
    (event) => event.intervalMinutes > 0
  );

  const activeEvents = scheduledEvents.filter(
    (event) => isEventActive(event, now)
  );

  const activeEvent: SkyEvent | undefined =
    activeEvents.sort(
      (a, b) =>
        getPreviousEventTime(b, now).getTime() -
        getPreviousEventTime(a, now).getTime()
    )[0];

  const upcoming = scheduledEvents
    .map((event) => ({
      event,
      time: getNextEventTime(event, now),
    }))
    .sort(
      (a, b) =>
        a.time.getTime() - b.time.getTime()
    );

  const next = upcoming[0];

  // 前回のイベント開始時刻
  const previousTime = Math.max(
    ...scheduledEvents.map((event) =>
      getPreviousEventTime(event, now).getTime()
    )
  );

  const nextTime =
    next?.time.getTime() ?? now.getTime();

  const total = nextTime - previousTime;
  const elapsed = now.getTime() - previousTime;

  const progress =
    total > 0
      ? Math.min(1, Math.max(0, elapsed / total))
      : 0;

  // 光点を時計回りに移動
  const angle =
    progress * Math.PI * 2 - Math.PI / 2;

  const radius = 116;
  const dotX = 150 + Math.cos(angle) * radius;
  const dotY = 150 + Math.sin(angle) * radius;
  const statuses = getLandscapeStatuses(now);
  const currentTime = now.toLocaleTimeString(
  "ja-JP",
  {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }
);

  return (
    <div className="landscape-clock">
      <div className="landscape-clock-inner">

        {/* 左側：NOW */}
        <div className="landscape-clock-left">
          <div className="landscape-orbit">
            <svg
              className="landscape-orbit-svg"
              viewBox="0 0 300 300"
              aria-hidden="true"
            >
              <circle
                cx="150"
                cy="150"
                r="116"
                fill="none"
                stroke="rgba(255,255,255,.18)"
                strokeWidth="1"
              />

              <circle
                cx={dotX}
                cy={dotY}
                r="5"
                fill="white"
                className="landscape-orbit-dot"
              />
            </svg>

            <div className="landscape-orbit-center">
              {activeEvent ? (
                <img
                  src={activeEvent.icon}
                  alt={activeEvent.title}
                  className="landscape-now-icon"
                />
              ) : (
                <DotNone />
              )}
            </div>
          </div>
        </div>

        {/* 右側 */}
        <div className="landscape-clock-right">

          <div className="landscape-next">
            <span className="landscape-label">
              NEXT
            </span>

            <h2>
              {next ? next.event.englishTitle : "NONE"}
            </h2>
          </div>

          {/* 花鳥郷・AURORA情報は次に追加 */}

<div className="landscape-status">
  <div className="landscape-status-row">
    <span>AVIARY VILLAGE</span>
    <span>[ {statuses.aviary} ]</span>
  </div>

  <div className="landscape-status-row">
    <span>ARLES</span>
    <span>[ {statuses.arles} ]</span>
  </div>

  <div className="landscape-status-row landscape-status-aurora">
    <span>AURORA</span>
    <span>[ {statuses.aurora} ]</span>
  </div>
</div>

          <div className="landscape-current-time">
            {currentTime}
          </div>

        </div>
      </div>
    </div>
  );
}
