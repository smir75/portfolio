// src/App.jsx
import MoonScene from "@/scene/MoonScene.jsx";
import { SettingsProvider } from "./state/settings.jsx";

export default function App() {
  return (
    <SettingsProvider>
      <div className="w-full h-full">
        <MoonScene />
      </div>
    </SettingsProvider>
  );
}
