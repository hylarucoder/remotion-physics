import { Composition } from "remotion";
import { PhysicsAnimation, physicsAnimationSchema } from "./PhysicsAnimation";
import { PoolGame, poolGameSchema } from "./PoolGame";
import Clip from "./Fireworks/Clip";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PhysicsAnimation"
        component={PhysicsAnimation}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        schema={physicsAnimationSchema}
        defaultProps={{
          name: "Remotion",
          title: "RevidCraft\nLet's Make More\nRemotion Animations",
          backgroundColor: "#3ec5ff",
          circleColor: "#1A1A1A",
        }}
      />

      <Composition
        id="PoolGame"
        component={PoolGame}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
        schema={poolGameSchema}
        defaultProps={{}}
      />
      <Composition
        id="Fireworks"
        component={Clip}
        durationInFrames={30 * 30}
        fps={30}
        width={1920}
        height={1080}
        schema={poolGameSchema}
        defaultProps={{}}
      />
    </>
  );
}