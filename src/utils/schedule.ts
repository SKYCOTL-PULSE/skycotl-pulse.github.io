import type { SkyEvent } from "../data/events";
import { getSkyDayStart } from "./skyTime";


/* FIREWORKS
 花鳥郷花火大会
 *
 Sky時間（America/Los_Angeles）
 毎月1日
 
 0:00
 04:00
 08:00
 12:00
 16:00
 20:00
 
 日本時間
 *
 * PDT:
 1日 16:00 / 20:00
 2日 00:00 / 04:00 / 08:00 / 12:00
 *
 PST:
 1日 17:00 / 21:00
 * 2日 01:00 / 05:00 / 09:00 / 13:00
 */

const FIREWORKS_HOURS = [
  0,
  4,
  8,
  12,
  16,
  20,
];


/*現在のSky年月日を取得*/
function getSkyDateParts(now: Date) {
  const formatter =
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

  const parts =
    formatter.formatToParts(now);

  return {
    year: Number(
      parts.find(
        (part) => part.type === "year"
      )?.value
    ),

    month: Number(
      parts.find(
        (part) => part.type === "month"
      )?.value
    ),

    day: Number(
      parts.find(
        (part) => part.type === "day"
      )?.value
    ),
  };
}


/*指定したSky年月の1日 00:00 を取得*/
function getSkyMonthStart(
  year: number,
  month: number
): Date {
  /*
   その月の1日付近のDateを作る。
   12:00 UTCにして日付境界の影響を避ける。*/
  const probe = new Date(
    Date.UTC(
      year,
      month - 1,
      1,
      12,
      0,
      0,
      0
    )
  );

  return getSkyDayStart(probe);
}


/*指定した月の花火6回を作る*/
function getFireworksTimesForMonth(
  year: number,
  month: number
): Date[] {
  const monthStart =
    getSkyMonthStart(year, month);

return FIREWORKS_HOURS.map(
  (hour) =>
    new Date(
      monthStart.getTime() +
        hour * 60 * 60 * 1000
    )
);
}


/*次回花火*/
function getNextFireworksTime(
  now: Date
): Date {
  const {
    year,
    month,
  } = getSkyDateParts(now);

  /*今月分を確認*/
  const thisMonth =
    getFireworksTimesForMonth(
      year,
      month
    );

  const nextThisMonth =
    thisMonth.find(
      (time) =>
        time.getTime() >
        now.getTime()
    );

  if (nextThisMonth) {
    return nextThisMonth;
  }

  /*今月分が終了していたら次月*/
  let nextYear = year;
  let nextMonth = month + 1;

  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  return getFireworksTimesForMonth(
    nextYear,
    nextMonth
  )[0];
}


/*直前の花火*/
function getPreviousFireworksTime(
  now: Date
): Date {
  const {
    year,
    month,
  } = getSkyDateParts(now);

  const thisMonth =
    getFireworksTimesForMonth(
      year,
      month
    );

  /*現在以前の花火だけ取り出して、最後のものを取得*/
  const previousThisMonth =
    thisMonth
      .filter(
        (time) =>
          time.getTime() <=
          now.getTime()
      )
      .at(-1);

  if (previousThisMonth) {
    return previousThisMonth;
  }

  /*今月最初の花火より前なら前月最後の花火*/
  let previousYear = year;
  let previousMonth = month - 1;

  if (previousMonth < 1) {
    previousMonth = 12;
    previousYear -= 1;
  }

  return getFireworksTimesForMonth(
    previousYear,
    previousMonth
  ).at(-1)!;
}


/*PREVIOUS EVENT*/

export function getPreviousEventTime(
  event: SkyEvent,
  now: Date
): Date {
  if (event.type === "fireworks") {
    return getPreviousFireworksTime(now);
  }

  const skyStart =
    getSkyDayStart(now);

  /*
  Sky 00:00を基準にする。
   
   geyser  = +00分
   bread   = +30分
   turtle  = +50分
   */

  const firstEvent =
    skyStart.getTime() +
    event.startMinute *
      60 *
      1000;

  const intervalMs =
    event.intervalMinutes *
    60 *
    1000;

  const elapsed =
    now.getTime() -
    firstEvent;

  const cycles =
    Math.floor(
      elapsed / intervalMs
    );

  return new Date(
    firstEvent +
      cycles * intervalMs
  );
}


/*NEXT EVENT*/

export function getNextEventTime(
  event: SkyEvent,
  now: Date
): Date {
  if (event.type === "fireworks") {
    return getNextFireworksTime(now);
  }

  const previous =
    getPreviousEventTime(
      event,
      now
    );

  return new Date(
    previous.getTime() +
      event.intervalMinutes *
        60 *
        1000
  );
}


/*EVENT PROGRESS*/

export function getEventProgress(
  event: SkyEvent,
  now: Date
): number {
  const previous =
    getPreviousEventTime(
      event,
      now
    );

  const next =
    getNextEventTime(
      event,
      now
    );

  const total =
    next.getTime() -
    previous.getTime();

  const elapsed =
    now.getTime() -
    previous.getTime();

  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (elapsed / total) * 100
    )
  );
}


/*ACTIVE*/

export function isEventActive(
  event: SkyEvent,
  now: Date
): boolean {
  const previous =
    getPreviousEventTime(
      event,
      now
    );

  const end =
    previous.getTime() +
    event.durationMinutes *
      60 *
      1000;

  return (
    now.getTime() >=
      previous.getTime() &&
    now.getTime() < end
  );
}


/*EVENT END*/

export function getEventEndTime(
  event: SkyEvent,
  now: Date
): Date {
  const previous =
    getPreviousEventTime(
      event,
      now
    );

  return new Date(
    previous.getTime() +
      event.durationMinutes *
        60 *
        1000
  );
}