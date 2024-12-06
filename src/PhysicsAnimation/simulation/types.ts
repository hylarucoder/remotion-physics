export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsBody {
  id: string;
  position: Vector2D;
  angle: number;
  radius: number;
  isStatic: boolean;
  label: string;
}

export interface SimulationFrame {
  bodies: PhysicsBody[];
}

export interface SimulationConfig {
  width: number;
  height: number;
  duration: number;
  fps: number;
  gravity: Vector2D;
}

export interface SimulationState {
  frames: SimulationFrame[];
}