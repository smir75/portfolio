import * as THREE from "three";
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const toRad = (d) => (d * Math.PI) / 180;
export const angleBetween = (a, b) => Math.acos(clamp(a.dot(b), -1, 1));
export const lerp = (a, b, t) => a + (b - a) * t;
export const orientQuatFromUp = (pos, upAxis = new THREE.Vector3(0,1,0)) =>
  new THREE.Quaternion().setFromUnitVectors(upAxis, pos.clone().normalize());
export const makePos = (RADIUS, latDeg, lonDeg) => {
  const lat = toRad(latDeg), lon = toRad(lonDeg);
  const r = RADIUS + 0.06;
  return new THREE.Vector3(
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.sin(lat),
    r * Math.cos(lat) * Math.sin(lon)
  );
};
