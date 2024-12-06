import React from 'react';
import { Vector2D } from '../simulation/types';

interface PocketProps {
  position: Vector2D;
}

export const Pocket: React.FC<PocketProps> = ({ position }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: '60px',
        height: '60px',
        backgroundColor: '#000',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};