import type { SkyEvent } from "../../data/events";

import {
  getEventProgress,
  getNextEventTime,
  getEventEndTime,
  isEventActive,
} from "../../utils/schedule";

import {
  formatCountdown,
  formatTime,
} from "../../utils/time";

type EventCardProps = {
  event: SkyEvent;
  now: Date;
};

export default function EventCard({
  event,
  now,
}: EventCardProps) {
  const active = isEventActive(event, now);

  const nextTime = getNextEventTime(event, now);
  const endTime = getEventEndTime(event, now);

  const diff = active
    ? endTime.getTime() - now.getTime()
    : nextTime.getTime() - now.getTime();

  const progress = getEventProgress(event, now);

  return (
    <div
      className="event-card"
      style={{
        borderTop: `4px solid ${event.color}`,
      }}
    >
      <div className="event-header">
        <h2>
          <span className="event-icon">
  <img
    src={event.icon}
    alt=""
    className="event-icon-image"
  />
</span>

          <span className="desktop-title">
            {event.title} / {event.englishTitle}
          </span>

          <span className="mobile-title">
            {event.shortTitle} / {event.englishShortTitle}
          </span>
        </h2>
      </div>

      <div className="event-info">
        <div className="next-time-block">
          {active ? (
            <div className="live-label">
  <span>開催中</span>
  <span className="live-label-en">LIVE</span>
</div>
          ) : (
            <>
              <p className="label desktop-only next-label">
              次回開催 / NEXT EVENT
              </p>

              <div className="event-time">
<span className="mobile-only next-label">
  NEXT
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ verticalAlign: "middle", marginLeft: "4px" }}
  >
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
</span>

                <span>
                  {formatTime(nextTime)}
                </span>
              </div>
            </>
          )}
        </div>

        <div>
          <p className="label">
            {active
              ? "終了まで / UNTIL END"
              : "開始まで / UNTIL START"}
          </p>

          <p className="countdown">
            {formatCountdown(diff)}
          </p>
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${progress * 100}%`,
            background: event.color,
          }}
        />
      </div>
    </div>
  );
}