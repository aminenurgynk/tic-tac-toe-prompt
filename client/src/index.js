// index.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.scss";
import App from "./App";

import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>
);
