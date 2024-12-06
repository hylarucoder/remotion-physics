import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface TitleProps {
  text: string;
  subtitle?: string;
}

export const Title: React.FC<TitleProps> = ({ text, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    fps,
    frame: frame - 15,
    config: {
      damping: 200,
    },
  });

  const scale = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 100,
        top: 100,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <h1
        style={{
          fontSize: '120px',
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
          fontWeight: 'bold',
          margin: 0,
          color: 'white',
          lineHeight: '1',
        }}
      >
        {text}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: '24px',
            fontFamily: 'SF Pro Text, system-ui, sans-serif',
            margin: '20px 0',
            color: 'white',
            opacity: 0.8,
            whiteSpace: 'pre-line',
            lineHeight: '1.4',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};