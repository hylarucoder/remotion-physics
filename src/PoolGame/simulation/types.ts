export interface Vector2D {
  x: number;
  y: number;
}

export interface Ball {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  angle: number;
  radius: number;
  color: string;
  number?: number;
  isWhite?: boolean;
  opacity: number;
}

export interface SimulationFrame {
  balls: Ball[];
  pockets: Vector2D[];
}

export interface SimulationConfig {
  width: number;
  height: number;
  duration: number;
  fps: number;
}

export interface SimulationState {
  frames: SimulationFrame[];
}