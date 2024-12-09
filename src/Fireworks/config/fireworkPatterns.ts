import { random } from '../utils/random';

export type FireworkPattern = {
  particleCount: number;
  baseVelocity: number;
  velocityVariance: number;
  sizeVariance: number;
  gravity: number;
  trailLength: number;
  trailSpacing: number;
  particleSizeStart: number;
  particleSizeEnd: number;
};

export const patterns = {
  standard: {
    particleCount: 32,
    baseVelocity: 7.5,
    velocityVariance: 0.6,
    sizeVariance: 0.4,
    gravity: 0.012,
    trailLength: 24,
    trailSpacing: 1.2,
    particleSizeStart: 6,
    particleSizeEnd: 2.5,
  },
  dense: {
    particleCount: 48,
    baseVelocity: 6.5,
    velocityVariance: 0.4,
    sizeVariance: 0.3,
    gravity: 0.01,
    trailLength: 32,
    trailSpacing: 1.0,
    particleSizeStart: 5.5,
    particleSizeEnd: 2.2,
  },
  sparse: {
    particleCount: 24,
    baseVelocity: 9,
    velocityVariance: 0.8,
    sizeVariance: 0.5,
    gravity: 0.014,
    trailLength: 20,
    trailSpacing: 1.4,
    particleSizeStart: 7,
    particleSizeEnd: 3,
  },
  burst: {
    particleCount: 40,
    baseVelocity: 8.5,
    velocityVariance: 0.3,
    sizeVariance: 0.6,
    gravity: 0.011,
    trailLength: 28,
    trailSpacing: 1.1,
    particleSizeStart: 6.5,
    particleSizeEnd: 2.8,
  },
} as const;

export const getPatternForPosition = (
  x: number,
  y: number,
  width: number,
  height: number,
  seed: number
): FireworkPattern => {
  // Normalize coordinates to 0-1 range
  const normalizedX = x / width;
  const normalizedY = y / height;
  
  // Use position and seed to determine pattern
  const randomValue = random(0, 1, seed + 3);
  
  if (normalizedY < 0.3) {
    // Higher fireworks tend to be more sparse and faster
    return patterns.sparse;
  } else if (normalizedY > 0.6) {
    // Lower fireworks are denser and slower
    return patterns.dense;
  } else if (normalizedX < 0.3 || normalizedX > 0.7) {
    // Edge fireworks are more explosive
    return patterns.burst;
  } else if (randomValue > 0.7) {
    // Random special patterns
    return patterns.burst;
  }
  
  return patterns.standard;
};