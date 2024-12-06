import React from 'react';
import { Ball } from './Ball';
import { Pocket } from './Pocket';
import { SimulationFrame } from '../simulation/types';

interface PoolTableProps {
  frame: SimulationFrame;
}

export const PoolTable: React.FC<PoolTableProps> = ({ frame }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '1600px',
        height: '800px',
        backgroundColor: '#1B5E20',
        borderRadius: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 0 0 80px #0D4715',
        border: '0px solid #5D4037',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {frame.pockets.map((pocket, i) => (
        <Pocket key={i} position={pocket} />
      ))}
      {frame.balls.map((ball) => (
        <Ball key={ball.id} ball={ball} />
      ))}
    </div>
  );
};