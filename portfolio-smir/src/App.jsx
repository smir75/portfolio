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
import ClassicPortfolio from "./pages/ClassicPortfolio.jsx"; // ⬅️ new

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
  const [navTarget, setNavTarget] = useState(null);   // ⬅️ cible actuelle (station demandée)
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isClassicHome = pathname === "/";
  const isLunarHome = pathname === "/lunar";

  // prefetch
  useEffect(() => {
    if (isLunarHome) import("./scene/MoonScene.jsx").catch(() => {});
  }, [isLunarHome]);

  // Callback quand une station s'ouvre (depuis MoonScene / Scene)
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

  // Callback quand un clic TopNav demande une rotation vers une station
  const handleNavTarget = useCallback((id) => {
    setNavTarget(id);
  }, []);

  // Une fois la cible consommée (rotation terminée)
  const handleNavConsumed = useCallback(() => {
    setNavTarget(null);
  }, []);

  return (
    <SettingsProvider>
      {/* === Landing === */}
      {!entered && isLunarHome && <Landing onEnter={() => setEntered(true)} />}

      {/* === Scène 3D === */}
      {entered && isLunarHome && (
        <div
          id="scene-layer"
          aria-hidden={!isLunarHome}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            pointerEvents: isLunarHome ? "auto" : "none",
          }}
        >
          <Suspense fallback={null}>
            <MoonScene
              navTarget={navTarget}         // ⬅️ envoi de la cible à la scène
              onNavConsumed={handleNavConsumed}
              onOpenStation={handleOpenStation}
              reduceMotion={!isLunarHome}
              quality={isLunarHome ? "high" : "low"}
              uiBlocked={!isLunarHome}
            />
          </Suspense>
        </div>
      )}

      {/* === TopNav visible uniquement sur /lunar === */}
      {isLunarHome && (
        <>
          <TopNav stations={NAV_STATIONS} onNavTarget={handleNavTarget} /> {/* ⬅️ lien rétabli */}
          {entered && <CursorTrail enabled onlyOnSelector=".top-nav-glass" />}
        </>
      )}

      {/* === Layer Pages === */}
      <div id="page-layer" data-active={!isLunarHome}>
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
      // ⬇️ Par défaut "/" rend ton portfolio classique
      { index: true, element: <ClassicPortfolio /> },

      // ⬇️ La "home 3D" est maintenant sur /lunar (Landing + MoonScene)
      { path: "lunar", element: <></> },

      // ⬇️ Tes autres pages (inchangées)
      { path: "BTS", element: <BTS/> },
      { path: "Competences", element: <Competences/> },
      { path: "Contact", element: <Contact/> },
      { path: "Parcours", element: <Parcours/> },
      { path: "Projets", element: <Projets/> },
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
