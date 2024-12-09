import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from "remotion";
import { FireworksContainer } from "./components/FireworksContainer";

const poem1 = "海上生明月";
const poem2 = "天涯共此时";

export const Clip: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 60,
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: "#FFFACD",
          boxShadow: "0 0 20px #FFFACD",
          backgroundImage:
            'radial-gradient(circle, transparent 0%, #FFFACD 100%), url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="none" stroke="%23F0E68C" stroke-width="0.5" /></svg>\')',
          backgroundBlendMode: "soft-light",
          backgroundSize: "cover, 30px 30px",
          backgroundPosition: "center",
        }}
      />
      {[poem1, poem2].map((poemPart, pIndex) => (
        <div
          key={pIndex}
          style={{
            position: "absolute",
            right: 60,
            top: pIndex === 0 ? "25%" : "35%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "row",
            color: "#EEE",
            fontSize: 72,
            fontWeight: "bold",
            textShadow: "0 0 4px #FFFACD",
          }}
        >
          {poemPart.split("").map((char, index) => (
            <span
              key={index}
              style={{
                opacity: interpolate(
                  frame - (pIndex * 25 + index * 5),
                  [0, 20],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                ),
                marginRight: 10,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: height * 0.7,
          overflow: "hidden",
        }}
      >
        {[...Array(50)].map((_, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${random(index) * 1000}%`,
              top: `${random(index + 100) * 1000}%`,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#FFF",
              opacity: random(index + 200) * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.3,
          background: "linear-gradient(180deg, #001f3f, #003366)",
          overflow: "hidden",
        }}
      >
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${index * 7}%`,
              bottom: `${Math.sin(frame / 40 + index) * 15}px`,
              width: "120%",
              height: "15px",
              background: "rgba(173, 216, 230, 0.2)",
              transform: `rotate(${Math.sin(frame / 60 + index) * 2}deg)`,
              transformOrigin: "left bottom",
              boxShadow: "0 0 10px rgba(173, 216, 230, 0.3)",
            }}
          />
        ))}
      </div>

      <FireworksContainer frame={frame} width={width} height={height} />
    </AbsoluteFill>
  );
};

export default Clip;
