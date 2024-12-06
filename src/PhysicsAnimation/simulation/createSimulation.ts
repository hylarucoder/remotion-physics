import Matter from 'matter-js';
import { SimulationConfig, SimulationState, PhysicsBody } from './types';

export const createSimulation = (config: SimulationConfig): SimulationState => {
  const engine = Matter.Engine.create({
    gravity: config.gravity,
  });

  // Create static bodies
  const ground = Matter.Bodies.rectangle(960, 1100, 1920, 60, { 
    isStatic: true,
    label: 'ground'
  });
  
  const leftWall = Matter.Bodies.rectangle(-10, 540, 20, 1080, { 
    isStatic: true,
    label: 'wall'
  });
  
  const rightWall = Matter.Bodies.rectangle(1930, 540, 20, 1080, { 
    isStatic: true,
    label: 'wall'
  });

  // Create main circles
  const mainCircles = [
    Matter.Bodies.circle(1600, 300, 180, {
      isStatic: true,
      restitution: 1.2,
      friction: 0.1,
      label: 'mainCircle'
    }),
    Matter.Bodies.circle(1700, 800, 120, {
      isStatic: true,
      restitution: 1.2,
      friction: 0.1,
      label: 'mainCircle'
    }),
  ];

  // Create decorative circles
  const smallCircles = Array.from({ length: 8 }, (_, i) => {
    const x = 100 + Math.random() * 800;
    const y = Math.random() * config.height;
    const radius = 10 + Math.random() * 20;
    
    return Matter.Bodies.circle(x, y, radius, {
      isStatic: true,
      label: 'decorative'
    });
  });

  // Add all static bodies
  const staticBodies = [...mainCircles, ...smallCircles, ground, leftWall, rightWall];
  Matter.World.add(engine.world, staticBodies);

  // Create dynamic balls
  const balls = Array.from({ length: 15 }, (_, i) => {
    const targetCircle = mainCircles[Math.floor(Math.random() * mainCircles.length)];
    const offsetX = (Math.random() - 0.5) * 200;
    const x = targetCircle.position.x + offsetX;
    const radius = 15 + Math.random() * 15;
    
    const ball = Matter.Bodies.circle(x, -50 - i * 100, radius, {
      restitution: 0.8,
      friction: 0.05,
      density: 0.001,
      label: 'ball'
    });

    const velocityX = (Math.random() - 0.5) * 8;
    const velocityY = 5 + Math.random() * 5;
    Matter.Body.setVelocity(ball, { x: velocityX, y: velocityY });
    
    return ball;
  });

  Matter.World.add(engine.world, balls);

  // Simulate and record frames
  const frames: SimulationFrame[] = [];
  const totalFrames = config.duration * config.fps;

  for (let i = 0; i < totalFrames; i++) {
    Matter.Engine.update(engine, 1000 / config.fps);

    const bodies: PhysicsBody[] = [...staticBodies, ...balls].map(body => ({
      id: body.id,
      position: { x: body.position.x, y: body.position.y },
      angle: body.angle,
      radius: (body as Matter.Bodies.Circle).circleRadius || 0,
      isStatic: body.isStatic,
      label: body.label
    }));

    frames.push({ bodies });
  }

  return { frames };
};