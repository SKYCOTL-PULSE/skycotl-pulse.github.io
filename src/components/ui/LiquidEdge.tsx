
import { useState } from "react";
import "./LiquidEdge.css";
import LinkIcon from "../../assets/icon/Link.svg";

type MenuPage = "home" | "spec" | "social" | "review";

export default function LiquidEdge() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState<MenuPage>("home");

  const closeMenu = () => {
    setIsOpen(false);
    setPage("home");
  };

  return (
    <>
      <div
        className={`liquid-menu-overlay ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div
          key={page}
          className={`liquid-menu-content ${
            page !== "home" ? "is-subpage" : ""
          }`}
        >
          {page === "home" ? (
            <>
              <p className="liquid-menu-heading">
                SKY PULSE
              </p>

              <nav className="liquid-menu-list">
                <button
                  type="button"
                  onClick={() => setPage("spec")}
                >
                  仕様書/DOCUMENTATION
                </button>

                <button
                  type="button"
                  onClick={() => setPage("social")}
                >
                  SNSアカウント/SOCIAL MEDIA
                </button>

                <button
                  type="button"
                  onClick={() => setPage("review")}
                >
                  レビュー/REVIEW
                </button>
              </nav>
            </>
          ) : page === "spec" ? (
            <article className="liquid-spec">
              <p className="liquid-spec-eyebrow">
                SKY PULSE / DOCUMENTATION
              </p>

              <h1>仕様書</h1>

              <p className="liquid-spec-intro">
                Sky Pulseは「Sky 星を紡ぐ子どもたち」の
                デイリーイベント情報を確認するための非公式ダッシュボードです。
                <br /><br />
                シンプルで、スムーズで、直感的に操作できることを目指して作られています。
              </p>

              <section>
                <h2>01 / Sky Pulseとは</h2>
                <p>
                  定期開催されるイベントの開始時刻や、
                  次回開催までのカウントダウンを
                  リアルタイムで表示します。
                </p>
              </section>

              <section>
                <h2>02 / PCとスマートフォン</h2>
                <p>
                  PCでは広いレイアウトでイベントを一覧表示し、
                  配信向けのOBS機能を利用できます。
                  サイドメニューから任意で背景を切り替えられます。
                  <br />
                  スマートフォンでは2列のコンパクトな表示に切り替わります。
                </p>
              </section>

              <section>
                <h2>03 / テーマと色の変化</h2>
                <p>
                  PC版では、Cloud・Night・Starryなどのテーマを切り替えられます。
                  自動テーマでは時間帯に応じた背景を表示します。
                  <br />
                  スマートフォンでは、時間帯に応じて背景色が変化します。
                </p>
              </section>

              <section>
                <h2>04 / ウィジェット</h2>
                <p>
                  間欠泉・パン焼き・ウミガメの開催時刻に加え、
                  AURORAコンサート、花鳥郷の花火、
                  環境変化などを表示します。
                </p>
              </section>

              <section>
                <h2>05 / ギミック</h2>
                <p>
                  FloatingNowBarによるスクロール追従、
                  OBS向けの個別表示、
                  Liquid Edgeによるメニュー操作などを搭載しています。
                  <br />
                  Add Sky Pulse to your Home Screen from your browser for quick and easy access anytime.
Keep it close and make it part of your Sky routine.
<br />
ブラウザーで開いたのちにホーム画面に追加していただくことで、いつでも簡単に接続が可能になります。 ぜひご活用ください！
<br />
                  時間帯によってパルスちゃんの様子が変化します。
                  <br />
                  画面を横向きにすると・・・？
                </p>
              </section>

              <p className="liquid-spec-footer">
                Sky Pulse / Unofficial fan-made project
              </p>
            </article>
          ) : page === "social" ? (
  <article className="liquid-social">
              <p className="liquid-spec-eyebrow">
                SKY PULSE / SOCIAL MEDIA
              </p>

              <h1>SNSアカウント</h1>

              <nav className="liquid-social-links">
                <a
                  href="https://www.youtube.com/@SorhaOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube <span aria-hidden="true"><img src={LinkIcon} alt="" className="liquid-link-icon" /></span>
                </a>

                <a
                  href="https://x.com/Sorha01"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X <span aria-hidden="true"><img src={LinkIcon} alt="" className="liquid-link-icon" /></span>
                </a>

                <a
                  href="https://www.instagram.com/sorha01/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram <span aria-hidden="true"><img src={LinkIcon} alt="" className="liquid-link-icon" /></span>
                </a>
              </nav>
            </article>
          
) : (
  <article className="liquid-review">
    <p className="liquid-spec-eyebrow">
      SKY PULSE / FEEDBACK
    </p>

    <h1>レビュー</h1>

    <p className="liquid-review-text">
      Sky Pulseについてのご意見やアイデアがありますか？
      以下のフォームからぜひお聞かせください。
      <br />
      皆さんの声が、Sky Pulseをよりシンプルで、
      便利で、使いやすいものにする助けになります。
    </p>

    <p className="liquid-review-text-en">
      Have feedback or an idea for Sky Pulse?
      Let me know through the form below.
      <br />
      Your input helps make Sky Pulse simpler,
      more useful, and better for everyone.
    </p>

    <a
      className="liquid-review-link"
      href="https://docs.google.com/forms/d/e/1FAIpQLSfk4RjmP5Lu9f8JAW22jYEEtK54iRK9CJcY5eNWZsd5Xb6G2g/viewform"
      target="_blank"
      rel="noopener noreferrer"
    >
      Feedback Form
      <span aria-hidden="true"><img src={LinkIcon} alt="" className="liquid-link-icon" /></span>
    </a>
  </article>
)}

        </div>
      </div>

      {/* Liquid Edge本体 */}
      <div className={`liquid-edge ${isOpen ? "is-open" : ""}`}>
        <svg
          className="liquid-edge-shape"
          viewBox="0 0 80 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="
              M80 0
              C80 25 78 32 66 38
              C42 49 36 57 36 80
              C36 103 42 111 66 122
              C78 128 80 135 80 160
              Z
            "
            fill="currentColor"
          />
        </svg>

        {isOpen && page !== "home" && (
          <button
            key={`back-${page}`}
            className="liquid-edge-back"
            type="button"
            onClick={() => setPage("home")}
            aria-label="メニューに戻る"
          >
            <span className="liquid-back-icon" />
          </button>
        )}

        <button
          key={page}
          className="liquid-edge-orb"
          type="button"
          onClick={() => {
            if (isOpen) closeMenu();
            else setIsOpen(true);
          }}
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isOpen}
        >
          <span className="liquid-edge-orb-inner" />
          <span className="liquid-edge-close">
            <span />
            <span />
          </span>
        </button>
      </div>
    </>
  );
}
