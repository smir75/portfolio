// src/App.jsx
import React, { useState, Suspense, lazy } from "react";
import Landing from "./scene/Landing.jsx";
import { SettingsProvider } from "./state/settings.jsx";

const MoonScene = lazy(() => import("./scene/MoonScene.jsx"));

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <SettingsProvider>
      {!entered && <Landing onEnter={() => setEntered(true)} />}

      <div className="w-full h-full">
        {entered ? (
          <Suspense fallback={<div aria-hidden />}>
            <MoonScene />
          </Suspense>
        ) : null}
      </div>
    </SettingsProvider>
  );
}
