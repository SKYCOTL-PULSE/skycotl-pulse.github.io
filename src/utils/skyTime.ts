const SKY_TIME_ZONE = "America/Los_Angeles";

/*
 指定された瞬間の
 America/Los_Angeles のUTCオフセットを取得
 PDT = -420
 PST = -480
 */
export function getSkyUtcOffsetMinutes(
  date: Date
): number {
  const formatter = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: SKY_TIME_ZONE,
      timeZoneName: "longOffset",
    }
  );

  const parts = formatter.formatToParts(date);

  const zone =
    parts.find(
      (part) => part.type === "timeZoneName"
    )?.value ?? "GMT-08:00";

  const match = zone.match(
    /GMT([+-])(\d{2}):(\d{2})/
  );

  if (!match) {
    return -480;
  }

  const sign =
    match[1] === "+" ? 1 : -1;

  return (
    sign *
    (Number(match[2]) * 60 +
      Number(match[3]))
  );
}


/*
 現在属しているSkyの日付を取得端末タイムゾーンには依存しない。依存すんな自立しろ。
 */
export function getSkyDateParts(
  date: Date
) {
  const formatter = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: SKY_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  const parts = formatter.formatToParts(date);

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


/*
 現在のSky Dayの開始時刻
 
 America/Los_Angeles 00:00
 
 夏:
 PDT 00:00 = UTC 07:00
  冬:
 PST 00:00 = UTC 08:00
 */
export function getSkyDayStart(
  now: Date
): Date {
  const {
    year,
    month,
    day,
  } = getSkyDateParts(now);

  const utcMidnight = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      0,
      0,
      0,
      0
    )
  );

  const offsetMinutes =
    getSkyUtcOffsetMinutes(
      utcMidnight
    );

  return new Date(
    utcMidnight.getTime() -
      offsetMinutes * 60 * 1000
  );
}


/*
 世界共通の1時間周期での現在位置。端末のgetMinutes/getSecondsを使わない。
 0   = XX:00:00
 0.5 = XX:30:00
 1   = 次のXX:00:00
 */
export function getHourlyProgress(
  now: Date
): number {
  const hourMs =
    60 * 60 * 1000;

  const position =
    ((now.getTime() % hourMs) +
      hourMs) %
    hourMs;

  return position / hourMs;
}


/*世界共通1時間周期での経過秒0から3599*/
export function getHourlyElapsedSeconds(
  now: Date
): number {
  const hourSeconds = 60 * 60;

  return (
    Math.floor(now.getTime() / 1000) %
      hourSeconds +
    hourSeconds
  ) % hourSeconds;
}

/*人のソースを見るな、痴漢だぞ*/