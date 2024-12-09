import { useEffect, MutableRefObject } from "react";
import Matter from "matter-js";

export const useFrameUpdate = (
  engineRef: MutableRefObject<Matter.Engine | undefined>,
  frame: number,
) => {
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    Matter.Engine.update(engine, 1000 / 60);
  }, [frame, engineRef]);
};
