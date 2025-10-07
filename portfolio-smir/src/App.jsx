// src/App.jsx
import React, { useEffect, useState, Suspense, lazy, useCallback } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  useNavigate,
  useLocation,   // ← on regroupe ici
} from "react-router-dom";
import { SettingsProvider } from "./state/settings.jsx";

import Landing from "./scene/Landing.jsx";

// Pages
import BTS from "./pages/BTS.jsx";
import Competences from "./pages/Competences.jsx";
import Contact from "./pages/Contact.jsx";
import Parcours from "./pages/Parcours.jsx";
import Projets from "./pages/Projets.jsx";

// Scène 3D (lazy)
const MoonScene = lazy(() => import("./scene/MoonScene.jsx"));

/** Shell racine : overlay + scène + pages (Outlet) */
function Root() {
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  // Précharge la scène après le premier rendu
  useEffect(() => {
    import("./scene/MoonScene.jsx").catch(() => {});
  }, []);

  // Mapping stationId -> route (IDs normalisés en minuscule)
  const handleOpenStation = useCallback(
    (id) => {
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
    },
    [navigate]
  );

  return (
    <SettingsProvider>
      {/* Landing UNIQUEMENT sur la home (sinon ça couvre tes pages internes) */}
      {!entered && isHome && <Landing onEnter={() => setEntered(true)} />}

      {/* Scène 3D : UNIQUEMENT sur “/” */}
      <div className="w-full h-full">
        {entered && isHome && (
          <Suspense
            fallback={
              <div
                aria-hidden
                style={{ width: "100vw", height: "100vh", background: "#0b1220" }}
              />
            }
          >
            <MoonScene onOpenStation={handleOpenStation} />
          </Suspense>
        )}
      </div>

      {/* Pages : layer au-dessus du canvas (voir #page-layer dans index.css) */}
      <div id="page-layer" data-active={!isHome}>
        <Outlet />
      </div>
    </SettingsProvider>
  );
}

// Déclaration des routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <></> }, // Home "vide" : la Landing/Scène gère l'affichage
      { path: "BTS", element: <BTS /> },
      { path: "Competences", element: <Competences /> },
      { path: "Contact", element: <Contact /> },
      { path: "Parcours", element: <Parcours /> },
      { path: "Projets", element: <Projets /> },
      // { path: "*", element: <NotFound /> }, // optionnel
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}
