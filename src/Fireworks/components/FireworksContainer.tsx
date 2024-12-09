import { useMemo } from 'react';
import { Firework } from './Firework';
import { FIREWORK_COLORS, FIREWORK_CONFIG } from '../config/constants';
import { random } from '../utils/random';
import { getPatternForPosition } from '../config/fireworkPatterns';

interface FireworksContainerProps {
  frame: number;
  width: number;
  height: number;
}

export const FireworksContainer: React.FC<FireworksContainerProps> = ({ frame, width, height }) => {
  const fireworks = useMemo(() => {
    const result = [];
    const { spawnInterval, lifetime } = FIREWORK_CONFIG;
    
    for (let i = 0; i <= frame; i += spawnInterval) {
      if (frame - i < lifetime) {
        const seed = i * 1000;
        const x = random(width * 0.15, width * 0.85, seed + 1);
        const y = random(height * 0.15, height * 0.4, seed);
        
        result.push({
          id: i,
          x,
          y,
          startY: height,
          color: FIREWORK_COLORS[Math.floor(random(0, FIREWORK_COLORS.length, seed + 2))],
          startFrame: i,
          pattern: getPatternForPosition(x, y, width, height, seed),
        });
      }
    }
    return result;
  }, [frame, width, height]);

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      {fireworks.map((fw) => (
        <Firework
          key={fw.id}
          x={fw.x}
          y={fw.y}
          startY={fw.startY}
          color={fw.color}
          frame={frame - fw.startFrame}
          pattern={fw.pattern}
        />
      ))}
    </svg>
  );
};