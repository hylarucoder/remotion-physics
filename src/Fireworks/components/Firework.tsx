import { useMemo } from 'react';
import { random } from '../utils/random';
import { FIREWORK_CONFIG } from '../config/constants';
import { FireworkPattern } from '../config/fireworkPatterns';

interface FireworkProps {
  x: number;
  y: number;
  color: string;
  frame: number;
  startY: number;
  pattern: FireworkPattern;
}

export const Firework: React.FC<FireworkProps> = ({ x, y, color, frame, startY, pattern }) => {
  const particles = useMemo(() => {
    const result = [];
    const { 
      particleCount, 
      baseVelocity, 
      velocityVariance,
      sizeVariance,
      gravity, 
      trailLength,
      trailSpacing,
    } = pattern;
    
    const { launchDuration, fadeStartFrame } = FIREWORK_CONFIG;
    
    // Launch phase
    if (frame < launchDuration) {
      const progress = frame / launchDuration;
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      const currentY = startY - (startY - y) * easeProgress;
      
      // Generate launch trail
      const trailPoints = [];
      for (let i = 0; i < 15; i++) {
        const trailProgress = progress - (i * 0.02);
        if (trailProgress > 0) {
          const trailY = startY - (startY - y) * (1 - Math.pow(1 - trailProgress, 2));
          trailPoints.push({
            x,
            y: trailY,
            opacity: 0.6 * (1 - i / 15),
            sizeMultiplier: 1 - (i / 15) * 0.5
          });
        }
      }
      
      // Add the current position point
      trailPoints.unshift({
        x,
        y: currentY,
        opacity: 0.8,
        sizeMultiplier: 1
      });
      
      return [{ trail: trailPoints }];
    }

    const explosionFrame = frame - launchDuration;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const seed = i * 1000;
      
      const sizeMultiplier = 1 + random(-sizeVariance, sizeVariance, seed + 500);
      const baseAngleVelocity = (baseVelocity + random(-velocityVariance, velocityVariance, seed)) * sizeMultiplier;
      const trail = [];
      
      for (let t = 0; t < trailLength; t++) {
        const trailFrame = Math.max(0, explosionFrame - t * trailSpacing);
        const velocityDecay = Math.pow(Math.max(0.4, 1 - trailFrame / fadeStartFrame), 1.2);
        const velocity = baseAngleVelocity * velocityDecay;
        
        const particleX = x + Math.cos(angle) * velocity * trailFrame;
        const particleY = y + 
          Math.sin(angle) * velocity * trailFrame + 
          (gravity * trailFrame * trailFrame) / 2;
        
        const fadeProgress = Math.max(0, 1 - explosionFrame / (FIREWORK_CONFIG.lifetime - launchDuration));
        const trailFade = Math.pow(1 - t / trailLength, 1.5);
        const opacity = fadeProgress * trailFade * velocityDecay;
        
        trail.push({ 
          x: particleX, 
          y: particleY, 
          opacity,
          sizeMultiplier 
        });
      }
      
      result.push({ trail });
    }
    return result;
  }, [x, y, frame, startY, pattern]);

  if (frame >= FIREWORK_CONFIG.lifetime) return null;

  const progress = frame / FIREWORK_CONFIG.lifetime;
  const baseSize = pattern.particleSizeStart + 
    (pattern.particleSizeEnd - pattern.particleSizeStart) * progress;

  return (
    <g>
      {particles.map((particle, particleIndex) => (
        <g key={particleIndex}>
          {particle.trail.map((point, i) => (
            <g key={`${particleIndex}-${i}`}>
              {i > 0 && (
                <line
                  x1={particle.trail[i - 1].x}
                  y1={particle.trail[i - 1].y}
                  x2={point.x}
                  y2={point.y}
                  stroke={color}
                  strokeWidth={baseSize * point.sizeMultiplier * 0.8}
                  strokeOpacity={point.opacity * 0.8}
                  strokeLinecap="round"
                />
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r={baseSize * 0.5 * point.sizeMultiplier}
                fill={color}
                opacity={point.opacity}
              />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
};