import React from 'react';
import { Ball as BallType } from '../simulation/types';

interface BallProps {
  ball: BallType;
}

export const Ball: React.FC<BallProps> = ({ ball }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: ball.position.x,
        top: ball.position.y,
        width: ball.radius * 2,
        height: ball.radius * 2,
        backgroundColor: ball.color,
        borderRadius: '50%',
        transform: `translate(-50%, -50%) rotate(${ball.angle}rad)`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: ball.opacity,
        transition: 'transform 0.05s linear',
      }}
    >
      {!ball.isWhite && (
        <div
          style={{
            width: '28px', // Doubled from 14px
            height: '28px', // Doubled from 14px
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px', // Doubled from 10px
            fontWeight: 'bold',
            color: '#000',
            transform: `rotate(${-ball.angle}rad)`, // Counter-rotate the number to keep it upright
          }}
        >
          {ball.number}
        </div>
      )}
    </div>
  );
};