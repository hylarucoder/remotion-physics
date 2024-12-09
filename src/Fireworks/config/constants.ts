export const FIREWORK_COLORS = [
  '#ff4444', // Bright Red
  '#44ff44', // Bright Green
  '#4444ff', // Bright Blue
  '#ffff44', // Bright Yellow
  '#ff44ff', // Bright Magenta
  '#44ffff', // Bright Cyan
  '#ff8844', // Orange
  '#ff4488', // Pink
  '#88ff44', // Lime
  '#44ff88', // Spring Green
] as const;

export const FIREWORK_CONFIG = {
  lifetime: 180,
  spawnInterval: 90,
  launchDuration: 30,
  fadeStartFrame: 120,
} as const;