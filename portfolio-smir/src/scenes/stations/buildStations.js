import { makePos } from "@/utils/math3d";

export default function buildStations(RADIUS) {
  return [
    {
      id:"projets",
      short:"Projets",
      label:"Dôme Projets",
      type:"dome",
      color:"#7cc6ff",
      pos:makePos(RADIUS,  2,  12),
      openRadius: 0.18, // ✅ ~10°
      lines:["4 projets sélectionnés","Laravel • Vue • API"]
    },
    {
      id:"competences",
      short:"Skills",
      label:"Tour Compétences",
      type:"tower",
      color:"#ffb86b",
      pos:makePos(RADIUS,  0,  92),
      openRadius: 0.18, // idem
      lines:["Back/Front/DevOps","PHP • JS • Docker"]
    },
    {
      id:"parcours",
      short:"Parcours",
      label:"Anneau Parcours",
      type:"ring",
      color:"#7df9ff",
      pos:makePos(RADIUS, 18, 210),
      openRadius: 0.20, // un peu plus tolérant
      lines:["BTS SIO - SLAM","Alternance 2024–2026"]
    },
    {
      id:"contact",
      short:"Contact",
      label:"Hub Contact",
      type:"dish",
      color:"#ff7ab6",
      pos:makePos(RADIUS, -22, 300),
      openRadius: 0.22, // légèrement plus large pour confort
      lines:["LinkedIn • GitHub • Mail","Formulaire disponible"]
    },
    {
      id:"bts",
      short:"BTS",
      label:"BTS / Référentiel",
      type:"tower",
      color:"#9cff8a",
      pos:makePos(RADIUS, -10, 160),
      openRadius: 0.18,
      lines:["E4/E5 ↔ Projets","Compétences cochées"]
    },
  ];
}
