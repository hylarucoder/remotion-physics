import React from 'react';
import { PhysicsBody } from '../simulation/types';

interface CircleProps {
  body: PhysicsBody;
  color: string;
}

export const Circle: React.FC<CircleProps> = ({ body, color }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: body.position.x,
        top: body.position.y,
        width: body.radius * 2,
        height: body.radius * 2,
        backgroundColor: color,
        borderRadius: '50%',
        transform: `translate(-50%, -50%) rotate(${body.angle}rad)`,
      }}
    />
  );
};