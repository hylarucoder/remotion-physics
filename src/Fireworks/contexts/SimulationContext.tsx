import { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import Matter from 'matter-js';

interface SimulationContextType {
  engine: Matter.Engine | null;
  world: Matter.World | null;
  render: Matter.Render | null;
  dimensions: {
    width: number;
    height: number;
  };
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}

interface SimulationProviderProps {
  children: ReactNode;
  dimensions: {
    width: number;
    height: number;
  };
}

export const SimulationProvider: React.FC<SimulationProviderProps> = ({ children, dimensions }) => {
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.style.position = 'absolute';
      canvasRef.current.style.top = '0';
      canvasRef.current.style.left = '0';
      canvasRef.current.style.width = '100%';
      canvasRef.current.style.height = '100%';
      document.body.appendChild(canvasRef.current);
    }

    engineRef.current = Matter.Engine.create({
      gravity: { x: 0, y: 0.2, scale: 0.001 },
      enableSleeping: false,
    });

    renderRef.current = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engineRef.current,
      options: {
        width: dimensions.width,
        height: dimensions.height,
        wireframes: false,
        background: 'transparent',
      },
    });

    Matter.Render.run(renderRef.current);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engineRef.current);

    return () => {
      Matter.Render.stop(renderRef.current!);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engineRef.current!);
      if (canvasRef.current) {
        canvasRef.current.remove();
      }
    };
  }, [dimensions]);

  const value = {
    engine: engineRef.current,
    world: engineRef.current?.world ?? null,
    render: renderRef.current,
    dimensions,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};