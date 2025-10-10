export const BASE_RADIUS = 9.0;
export const ACCEL = 2.6, DAMP = 2.0, MAX_SPEED = 2.1, STEER = 3.6;
export const JUMP_V = 1.12, GRAV = 1.5, ALT_DAMP = 1.6;

const DEV = import.meta.env?.DEV ?? false;

export const ROCK_COUNT      = DEV ? 200 : 280;
export const SURF_PARTICLES  = DEV ? 320 : 520;
export const BELT_PARTS      = DEV ? 240 : 360;
export const SAT_COUNT       = DEV ? 5   : 7;

// Fenêtres (radians)
export const HOLO_ON = 0.20;
export const HOLO_START = 1.30;   // optionnel: un peu plus strict
export const ENTER_OPEN = 0.35;   // ~20° — aligne vraiment
