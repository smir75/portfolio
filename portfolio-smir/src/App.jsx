// src/App.jsx
import React, { useEffect, useState, Suspense, lazy, useCallback } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { SettingsProvider } from "./state/settings.jsx";

import Landing from "./scene/Landing.jsx";

// Pages
import BTS from "./pages/BTS.jsx";
import Competences from "./pages/Competences.jsx";
import Contact from "./pages/Contact.jsx";
import Parcours from "./pages/Parcours.jsx";
import Projets from "./pages/Projets.jsx";

// UI
import CursorTrail from "./scenes/ui/CursorTrail.jsx";
import TopNav from "./scenes/ui/TopNav.jsx";

// Scène 3D (lazy)
const MoonScene = lazy(() => import("./scene/MoonScene.jsx"));

/** Mini liste pour TopNav (pas besoin du RADIUS ici) */
const NAV_STATIONS = [
  { id: "projets",     short: "Projets",     label: "Dôme Projets" },
  { id: "competences", short: "Skills",      label: "Tour Compétences" },
  { id: "parcours",    short: "Parcours",    label: "Anneau Parcours" },
  { id: "contact",     short: "Contact",     label: "Hub Contact" },
  { id: "bts",         short: "BTS",         label: "BTS / Référentiel" },
];

function Root() {
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const uiBlocked = !isHome;

  useEffect(() => {
    import("./scene/MoonScene.jsx").catch(() => {});
  }, []);

  const handleOpenStation = useCallback((id) => {
    const key = String(id || "").toLowerCase();
    const route = {
      bts: "/BTS",
      competences: "/Competences",
      contact: "/Contact",
      parcours: "/Parcours",
      projets: "/Projets",
    }[key];
    if (route) navigate(route);
    else console.warn("[App] Unknown station id:", id);
  }, [navigate]);

  return (
    <SettingsProvider>
      {/* Landing uniquement sur Home */}
      {!entered && isHome && <Landing onEnter={() => setEntered(true)} />}

      {/* === SCÈNE 3D EN BACKDROP === */}
      {entered && (
        <div
          id="scene-layer"
          aria-hidden={!isHome}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,                 // sous TopNav (140) et sous #page-layer (120)
            pointerEvents: isHome ? "auto" : "none", // interactif seulement sur Home
          }}
        >
          <Suspense fallback={null}>
            <MoonScene
              onOpenStation={handleOpenStation}
              reduceMotion={!isHome}
              quality={isHome ? "high" : "low"}
              uiBlocked={!isHome}  
            />
          </Suspense>
        </div>
      )}

      {/* === TOPNAV AU-DESSUS DES PAGES ET DU CANVAS === */}
      <TopNav stations={NAV_STATIONS} />
      {entered && isHome && <CursorTrail enabled onlyOnSelector=".top-nav-glass" />}

      {/* Pages au-dessus du canvas, sous la TopNav */}
      <div id="page-layer" data-active={!isHome}>
        <Outlet />
      </div>
    </SettingsProvider>
  );
}

// Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <></> },
      { path: "BTS", element: <BTS /> },
      { path: "Competences", element: <Competences /> },
      { path: "Contact", element: <Contact /> },
      { path: "Parcours", element: <Parcours /> },
      { path: "Projets", element: <Projets /> },
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    />
  );
}
