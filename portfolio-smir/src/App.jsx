// src/App.jsx
import React, { useEffect, useState, Suspense, lazy, useCallback } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
  useNavigate,
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

/** Shell racine : overlay + scène + Outlet pour les pages */
function Root() {
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();

  // Précharge la scène après le premier rendu
  useEffect(() => {
    import("./scene/MoonScene.jsx").catch(() => {});
  }, []);

  // Mapping stationId -> route
  const handleOpenStation = useCallback(
    (id) => {
      const route = {
        bts: "/BTS",
        competences: "/Competences",
        contact: "/Contact",
        parcours: "/Parcours",
        projets: "/Projets",
      }[id];

      if (route) navigate(route);
      else console.warn("[App] Unknown station id:", id);
    },
    [navigate]
  );

  return (
    <SettingsProvider>
      {/* Accueil / overlay */}
      {!entered && <Landing onEnter={() => setEntered(true)} />}

      {/* Scène 3D */}
      <div className="w-full h-full">
        {entered && (
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

      {/* Pages rendues au-dessus de la scène */}
      <Outlet />
    </SettingsProvider>
  );
}

// Déclaration des routes (identiques à tes paths)
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // Home “vide” (Landing gère l’entrée)
      { index: true, element: <></> },

      { path: "BTS", element: <BTS /> },
      { path: "Competences", element: <Competences /> },
      { path: "Contact", element: <Contact /> },
      { path: "Parcours", element: <Parcours /> },
      { path: "Projets", element: <Projets /> },

      // Facultatif : 404
      // { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <RouterProvider
      router={router}
      future={{
        // Active les comportements de la v7 dès maintenant
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}
