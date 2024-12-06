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
    const angle = (i / 8) * Math.PI * 2;
    const radius = 15;
    const distance = 400;
    const x = 960 + Math.cos(angle) * distance;
    const y = 540 + Math.sin(angle) * distance;
    
    return Matter.Bodies.circle(x, y, radius, {
      isStatic: true,
      label: 'decorative'
    });
  });

  // Add all static bodies
  const staticBodies = [...mainCircles, ...smallCircles, ground, leftWall, rightWall];
  Matter.World.add(engine.world, staticBodies);

  // Create dynamic balls
  const balls = Array.from({ length: 30 }, (_, i) => {
    // 在屏幕上方均匀分布球的位置
    const x = 200 + (i % 10) * 160;  // 10列球,间隔160
    const startY = -100 - Math.floor(i / 10) * 100;  // 每行相差100高度
    
    const ball = Matter.Bodies.circle(x, startY, 15, {
      restitution: 0.3,  // 降低弹性，让球不要弹太高
      friction: 0.01,    // 降低摩擦力
      density: 0.01,     // 增加密度，让球下落更快
      label: 'ball',
      frictionAir: 0.001 // 降低空气阻力
    });

    // 给一个很小的初始水平速度,让运动更有趣
    const velocityX = ((i % 3) - 1) * 0.5;  // -0.5, 0, or 0.5
    Matter.Body.setVelocity(ball, { x: velocityX, y: 2 });  // 给一个初始向下的速度
    
    return ball;
  });

  Matter.World.add(engine.world, balls);

  // Simulate and record frames
  const frames: SimulationFrame[] = [];
  const totalFrames = config.duration * config.fps;
  
  // Physics simulation parameters
  const timeStep = 1 / config.fps;  // Time step in seconds
  const subSteps = 4;  // Number of physics sub-steps per frame
  const subTimeStep = timeStep / subSteps;  // Time step for each sub-step

  for (let i = 0; i < totalFrames; i++) {
    // Perform multiple physics updates per frame for better accuracy
    for (let j = 0; j < subSteps; j++) {
      Matter.Engine.update(engine, subTimeStep);
    }

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