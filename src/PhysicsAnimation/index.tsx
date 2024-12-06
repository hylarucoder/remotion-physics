import { AbsoluteFill } from 'remotion';
import { PhysicsScene } from './components/PhysicsScene';
import { Title } from './components/Title';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

export const physicsAnimationSchema = z.object({
  name: z.string(),
  title: z.string(),
  backgroundColor: zColor(),
  circleColor: zColor(),
});

export const PhysicsAnimation: React.FC<z.infer<typeof physicsAnimationSchema>> = ({
  name,
  title,
  backgroundColor,
  circleColor,
}) => {
  return (
    <AbsoluteFill>
      <PhysicsScene backgroundColor={backgroundColor} circleColor={circleColor} />
      <Title text={name} subtitle={title} />
    </AbsoluteFill>
  );
};