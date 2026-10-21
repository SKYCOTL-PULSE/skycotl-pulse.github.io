import WaveTimeline from "./WaveTimeline";

export default function EnvironmentWidget() {
  return (
    <div className="environment-widget">
      <h2 className="special-title">
        <span>環境変化 / Environment Cycle</span>
      </h2>

      <WaveTimeline />
    </div>
  );
}