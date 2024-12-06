import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { PoolTable } from './components/PoolTable';
import { createSimulation } from './simulation/createSimulation';
import { z } from 'zod';

export const poolGameSchema = z.object({});

export const PoolGame: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();

  const simulation = useMemo(
    () =>
      createSimulation({
        width,
        height,
        duration: durationInFrames / fps,
        fps,
      }),
    [width, height, durationInFrames, fps]
  );

  const currentFrame = simulation.frames[frame];

  return (
    <AbsoluteFill style={{ backgroundColor: '#263238' }}>
      <PoolTable frame={currentFrame} />
    </AbsoluteFill>
  );
};