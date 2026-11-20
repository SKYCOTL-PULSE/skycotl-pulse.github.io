import {
  useEffect,
  useRef,
  useState,
} from "react";

import EventCard from "../components/cards/EventCard";
import NowCard from "../components/cards/NowCard";
import FireworksWidget from "../components/widgets/FireworksWidget";
import AuroraWidget from "../components/widgets/AuroraWidget";
import EnvironmentWidget from "../components/widgets/EnvironmentWidget";
import FloatingNowBar from "../components/ui/FloatingNowBar";
import Logo from "../components/ui/Logo";
import LiquidEdge from "../components/ui/LiquidEdge";
import LandscapeClock from "../components/widgets/LandscapeClock";
import ControlBar from "../layouts/ControlBar";

import { getTimeTheme } from "../utils/theme";
import { useTheme } from "../themes/ThemeProvider";
import { events } from "../data/events";

export default function Home() {
  const [now, setNow] = useState(new Date());

  // 上部のFloating Barを表示するか
  const [showFloatingNow, setShowFloatingNow] =
    useState(false);

  // 元のNowCardを監視するためのRef
  const nowCardRef =
    useRef<HTMLDivElement | null>(null);

  const { theme } = useTheme();

  /*時計更新*/
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /*NowCardが画面上へ消えたらFloatingNowBarを表示*/
  useEffect(() => {
    const element = nowCardRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const passedTop =
          entry.boundingClientRect.bottom <= 0;

        setShowFloatingNow(
          !entry.isIntersecting && passedTop
        );
      },
      {
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const timeTheme = getTimeTheme(now);

  const backgroundClass =
    theme === "auto"
      ? `time-${timeTheme}`
      : "";

  return (
     <>
      <LandscapeClock now={now} />
      <LiquidEdge />
      <ControlBar />

      {/* NowCardが上に消えた時だけ表示 */}
      <FloatingNowBar
        events={events}
        now={now}
        visible={showFloatingNow}
      />

      <main
        className={`home ${backgroundClass}`}
      >
        <Logo />

        {/* この領域を監視 */}
        <div ref={nowCardRef}>
          <NowCard
            events={events}
            now={now}
          />
        </div>

        <p className="subtitle">
          Sky Event Dashboard
        </p>

        <div className="cards">
          {events
            .filter(
              (event) =>
                event.type !== "fireworks"
            )
            .map((event) => (
              <EventCard
                key={event.id}
                event={event}
                now={now}
              />
            ))}

          {/* スマホではカメの横に表示 */}
          <div className="mobile-aurora">
            <AuroraWidget />
          </div>
        </div>

        <div className="special-events-grid">
          <FireworksWidget />

          {/* PCでは花火の横に表示 */}
          <div className="desktop-aurora">
            <AuroraWidget />
          </div>
        </div>

        <EnvironmentWidget />
      </main>
    </>
  );
}