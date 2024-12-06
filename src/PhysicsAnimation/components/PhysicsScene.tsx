import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Circle } from './Circle';
import { createSimulation } from '../simulation/createSimulation';

interface PhysicsSceneProps {
  backgroundColor: string;
  circleColor: string;
}

export const PhysicsScene: React.FC<PhysicsSceneProps> = ({
  backgroundColor,
  circleColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  const simulation = useMemo(() => createSimulation({
    width,
    height,
    duration: durationInFrames / fps,
    fps,
    gravity: { x: 0, y: 1 }
  }), [width, height, durationInFrames, fps]);

  const currentFrame = simulation.frames[frame];

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {currentFrame.bodies.map((body) => (
        <Circle
          key={body.id}
          body={body}
          color={circleColor}
        />
      ))}
    </AbsoluteFill>
  );
};