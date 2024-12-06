import Matter from 'matter-js';
import { SimulationConfig, SimulationState, Ball, Vector2D } from './types';

const BALL_RADIUS = 30; // Doubled from 15
const TABLE_WIDTH = 1600; // Doubled from 800
const TABLE_HEIGHT = 800; // Doubled from 400
const POCKET_RADIUS = 50; // Doubled from 25
const TABLE_PADDING = 120; // Doubled from 60
const POCKET_FADE_THRESHOLD = 0.66;

const BALL_COLORS = [
  '#FDD835', // 1 - Yellow
  '#1E88E5', // 2 - Blue
  '#E53935', // 3 - Red
  '#8E24AA', // 4 - Purple
  '#FF9800', // 5 - Orange
  '#2E7D32', // 6 - Green
  '#6D4C41', // 7 - Brown
  '#212121', // 8 - Black
];

const getPocketProgress = (ball: Matter.Body, pocket: Vector2D): number => {
  const dx = ball.position.x - pocket.x;
  const dy = ball.position.y - pocket.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, Math.min(1, distance / POCKET_RADIUS));
};

export const createSimulation = (config: SimulationConfig): SimulationState => {
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: 0 },
  });

  const cushionOptions = {
    isStatic: true,
    restitution: 0.95,
    friction: 0.2,
    chamfer: { radius: 10 }, // Doubled from 5
  };

  const walls = [
    Matter.Bodies.rectangle(
      TABLE_WIDTH/2,
      TABLE_PADDING/2,
      TABLE_WIDTH - POCKET_RADIUS * 4,
      40, // Doubled from 20
      cushionOptions
    ),
    Matter.Bodies.rectangle(
      TABLE_WIDTH/2,
      TABLE_HEIGHT - TABLE_PADDING/2,
      TABLE_WIDTH - POCKET_RADIUS * 4,
      40, // Doubled from 20
      cushionOptions
    ),
    Matter.Bodies.rectangle(
      TABLE_PADDING/2,
      TABLE_HEIGHT/2,
      40, // Doubled from 20
      TABLE_HEIGHT - POCKET_RADIUS * 4,
      cushionOptions
    ),
    Matter.Bodies.rectangle(
      TABLE_WIDTH - TABLE_PADDING/2,
      TABLE_HEIGHT/2,
      40, // Doubled from 20
      TABLE_HEIGHT - POCKET_RADIUS * 4,
      cushionOptions
    ),
  ];

  const pocketPositions: Vector2D[] = [
    { x: TABLE_PADDING, y: TABLE_PADDING },
    { x: TABLE_WIDTH/2, y: TABLE_PADDING },
    { x: TABLE_WIDTH - TABLE_PADDING, y: TABLE_PADDING },
    { x: TABLE_PADDING, y: TABLE_HEIGHT - TABLE_PADDING },
    { x: TABLE_WIDTH/2, y: TABLE_HEIGHT - TABLE_PADDING },
    { x: TABLE_WIDTH - TABLE_PADDING, y: TABLE_HEIGHT - TABLE_PADDING },
  ];

  const whiteBall = Matter.Bodies.circle(
    TABLE_WIDTH * 0.25,
    TABLE_HEIGHT * 0.5,
    BALL_RADIUS,
    {
      restitution: 0.95,
      friction: 0.005,
      density: 0.002,
      label: 'white',
      frictionAir: 0.001,
      slop: 0,
      torque: 0,
    }
  );

  Matter.Body.setVelocity(whiteBall, { x: 20, y: 0 });

  const balls: Matter.Body[] = [];
  const startX = TABLE_WIDTH * 0.75;
  const startY = TABLE_HEIGHT * 0.5;
  const spacing = BALL_RADIUS * 2.05;

  const triangleLayout = [
    [1],
    [2, 3],
    [4, 5, 6],
    [7, 8, 9, 10],
    [11, 12, 13, 14, 15],
  ];

  let row = 0;
  triangleLayout.forEach((rowBalls) => {
    const rowOffset = (rowBalls.length - 1) * spacing * 0.5;
    rowBalls.forEach((ballNumber, col) => {
      const x = startX + (row * spacing * 0.866);
      const y = startY - rowOffset + (col * spacing);
      
      const ball = Matter.Bodies.circle(x, y, BALL_RADIUS, {
        restitution: 0.95,
        friction: 0.005,
        density: 0.002,
        label: `ball${ballNumber}`,
        frictionAir: 0.001,
        slop: 0,
        torque: 0,
        render: {
          fillStyle: BALL_COLORS[(ballNumber - 1) % BALL_COLORS.length]
        }
      });

      (ball as any).ballNumber = ballNumber;
      balls.push(ball);
    });
    row++;
  });

  Matter.World.add(engine.world, [...walls, whiteBall, ...balls]);

  const frames: SimulationFrame[] = [];
  const totalFrames = config.duration * config.fps;
  const activeBalls = new Set([whiteBall, ...balls]);
  const ballOpacities = new Map<Matter.Body, number>();

  for (let i = 0; i < totalFrames; i++) {
    Matter.Engine.update(engine, 1000 / config.fps);

    activeBalls.forEach(ball => {
      let minProgress = 1;
      for (const pocket of pocketPositions) {
        const progress = getPocketProgress(ball, pocket);
        minProgress = Math.min(minProgress, progress);
      }

      if (minProgress < 1) {
        const opacity = Math.min(1, minProgress / POCKET_FADE_THRESHOLD);
        ballOpacities.set(ball, opacity);
        
        if (minProgress < POCKET_FADE_THRESHOLD) {
          Matter.World.remove(engine.world, ball);
          activeBalls.delete(ball);
        }
      }
    });

    const ballsState: Ball[] = Array.from(activeBalls).map(body => {
      const isWhiteBall = body === whiteBall;
      const ballNumber = (body as any).ballNumber;
      return {
        id: body.id.toString(),
        position: { x: body.position.x, y: body.position.y },
        velocity: { x: body.velocity.x, y: body.velocity.y },
        angle: body.angle,
        radius: BALL_RADIUS,
        color: isWhiteBall ? '#FFFFFF' : BALL_COLORS[(ballNumber - 1) % BALL_COLORS.length],
        number: isWhiteBall ? undefined : ballNumber,
        isWhite: isWhiteBall,
        opacity: ballOpacities.get(body) ?? 1
      };
    });

    frames.push({
      balls: ballsState,
      pockets: pocketPositions
    });
  }

  return { frames };
};