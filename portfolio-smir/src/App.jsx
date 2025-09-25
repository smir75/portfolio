// src/App.jsx
import React, { useEffect, useState, Suspense, lazy } from "react";
import Landing from "./scene/Landing.jsx";
import { SettingsProvider } from "./state/settings.jsx";

const MoonScene = lazy(() => import("./scene/MoonScene.jsx"));

export default function App() {
  const [entered, setEntered] = useState(false);

  // ✅ Précharge le chunk MoonScene dès le mount (supprime le flash)
  useEffect(() => {
    import("./scene/MoonScene.jsx").catch(() => {});
  }, []);

  return (
    <SettingsProvider>
      {!entered && <Landing onEnter={() => setEntered(true)} />}

      <div className="w-full h-full">
        {entered ? (
          // ✅ Fallback plein écran, même fond que l’app
          <Suspense
            fallback={
              <div
                aria-hidden
                style={{
                  width: "100vw",
                  height: "100vh",
                  background: "#0b1220",
                }}
              />
            }
          >
            <MoonScene />
          </Suspense>
        ) : null}
      </div>
    </SettingsProvider>
  );
}
