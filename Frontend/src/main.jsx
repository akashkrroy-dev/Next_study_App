import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

import "./style/theme.css";
import "./style/fonts.css";
import "./index.css";
import App from "./App.jsx";

const storedTheme = localStorage.getItem("nexstudy-theme")
const theme = storedTheme === "LIGHT" || storedTheme === "DARK" ? storedTheme : "DARK"
document.documentElement.setAttribute("data-theme", theme)

gsap.registerPlugin(Draggable);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)