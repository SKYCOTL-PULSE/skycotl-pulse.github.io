import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import "./styles/global.css";
import "./styles/schedule-card.css";
import "./styles/fireworks-widget.css";
import "./styles/now-card.css";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
  </StrictMode>
);

  /*
  人のソースコードを見るなよ、照れるだろ
  Stop looking at the source code, I'll get embarrassed///
  */