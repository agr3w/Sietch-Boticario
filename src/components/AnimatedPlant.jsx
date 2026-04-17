import { motion as Motion } from "framer-motion";
import { useMediaQuery, useTheme } from "@mui/material";

const stemSegmentA = {
  p0: { x: 20, y: 300 },
  p1: { x: 20, y: 200 },
  p2: { x: 150, y: 250 },
  p3: { x: 130, y: 50 },
};

const stemSegmentB = {
  p0: { x: 130, y: 50 },
  p1: { x: 125, y: 0 },
  p2: { x: 80, y: 30 },
  p3: { x: 100, y: 60 },
};

function cubicAt(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  );
}

function cubicDerivativeAt(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return (
    3 * mt * mt * (p1 - p0) +
    6 * mt * t * (p2 - p1) +
    3 * t * t * (p3 - p2)
  );
}

function pointOnCubic(segment, t) {
  return {
    x: cubicAt(segment.p0.x, segment.p1.x, segment.p2.x, segment.p3.x, t),
    y: cubicAt(segment.p0.y, segment.p1.y, segment.p2.y, segment.p3.y, t),
  };
}

function tangentOnCubic(segment, t) {
  const dx = cubicDerivativeAt(segment.p0.x, segment.p1.x, segment.p2.x, segment.p3.x, t);
  const dy = cubicDerivativeAt(segment.p0.y, segment.p1.y, segment.p2.y, segment.p3.y, t);
  const length = Math.hypot(dx, dy) || 1;

  return {
    x: dx / length,
    y: dy / length,
  };
}

function AnimatedPlant({ side = "left" }) {
  const isRight = side === "right";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const stemSwing = isMobile ? 0.55 : 1.1;
  const leafSwing = isMobile ? 4.2 : 7.2;
  const leafSkew = isMobile ? 1.2 : 2.2;
  const introDelayBase = isMobile ? 0.4 : 0.5;

  const fronds = Array.from({ length: 13 }, (_, i) => {
    const onFirstSegment = i < 10;
    const t = onFirstSegment
      ? 0.08 + i * 0.085
      : 0.1 + (i - 10) * 0.22;
    const segment = onFirstSegment ? stemSegmentA : stemSegmentB;
    const anchor = pointOnCubic(segment, Math.min(t, 0.95));
    const tangent = tangentOnCubic(segment, Math.min(t, 0.95));
    const normal = { x: -tangent.y, y: tangent.x };
    const dir = i % 2 === 0 ? 1 : -1;
    const connector = Math.max(5, 10 - i * 0.35);
    const size = Math.max(9.5, 21 - i * 0.85);
    const base = {
      x: anchor.x + normal.x * connector * dir,
      y: anchor.y + normal.y * connector * dir,
    };

    return {
      i,
      anchorX: anchor.x,
      anchorY: anchor.y,
      baseX: base.x,
      baseY: base.y,
      tangent,
      dir,
      size,
    };
  });

  const buildLeafPath = (baseX, baseY, tangent, dir, size) => {
    const normal = { x: -tangent.y * dir, y: tangent.x * dir };
    const along = { x: tangent.x, y: tangent.y };

    const tipX = baseX + normal.x * size + along.x * (size * 0.2);
    const tipY = baseY + normal.y * size + along.y * (size * 0.2);

    const upperCtrlX =
      baseX + normal.x * (size * 0.62) + along.x * (size * 0.36);
    const upperCtrlY =
      baseY + normal.y * (size * 0.62) + along.y * (size * 0.36);

    const lowerCtrlX =
      baseX + normal.x * (size * 0.4) - along.x * (size * 0.25);
    const lowerCtrlY =
      baseY + normal.y * (size * 0.4) - along.y * (size * 0.25);

    return `M${baseX} ${baseY} Q${upperCtrlX} ${upperCtrlY}, ${tipX} ${tipY} Q${lowerCtrlX} ${lowerCtrlY}, ${baseX} ${baseY} Z`;
  };

  return (
    <Motion.svg
      width="300"
      height="400"
      viewBox="0 0 200 300"
      style={{
        position: "absolute",
        bottom: -20,
        left: isRight ? "auto" : -30,
        right: isRight ? 20 : "auto",
        zIndex: 0,
        opacity: isMobile ? 0.28 : 0.35,
        transform: isRight ? "scaleX(-1)" : "none",
        pointerEvents: "none",
      }}
      aria-hidden="true"
      focusable="false"
    >
      <Motion.path
        d="M20 300 C 20 200, 150 250, 130 50 C 125 0, 80 30, 100 60"
        stroke="#4A7A2F"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        style={{ transformOrigin: "20px 300px" }}
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: 1,
          rotate: [0, stemSwing, 0, -stemSwing, 0],
        }}
        transition={{
          pathLength: { duration: 2.5, ease: "easeOut" },
          rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
        }}
      />

      {fronds.map((frond) => {
        const leafPath = buildLeafPath(
          frond.baseX,
          frond.baseY,
          frond.tangent,
          frond.dir,
          frond.size,
        );

        return (
          <Motion.g
            key={frond.i}
            style={{ transformOrigin: `${frond.anchorX}px ${frond.anchorY}px` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate:
                frond.dir === 1
                  ? [0, leafSwing, -leafSwing * 0.45, 0]
                  : [0, -leafSwing, leafSwing * 0.45, 0],
              skew: frond.dir === 1 ? [0, leafSkew, 0] : [0, -leafSkew, 0],
            }}
            transition={{
              scale: { delay: introDelayBase + frond.i * 0.08, duration: 0.75 },
              opacity: { delay: introDelayBase + frond.i * 0.08, duration: 0.45 },
              rotate: {
                repeat: Infinity,
                duration: (isMobile ? 5.6 : 4.2) + frond.i * 0.22,
                ease: "easeInOut",
                delay: frond.i * 0.1,
              },
              skew: {
                repeat: Infinity,
                duration: (isMobile ? 6.2 : 5.0) + frond.i * 0.08,
                ease: "easeInOut",
                delay: frond.i * 0.08,
              },
            }}
          >
            <Motion.path
              d={`M${frond.anchorX} ${frond.anchorY} Q${(frond.anchorX + frond.baseX) / 2} ${(frond.anchorY + frond.baseY) / 2}, ${frond.baseX} ${frond.baseY}`}
              stroke="#5D7E33"
              strokeWidth="1.35"
              fill="none"
              strokeLinecap="round"
            />

            <Motion.path d={leafPath} fill="#6B8E23" />
          </Motion.g>
        );
      })}
    </Motion.svg>
  );
}

export default AnimatedPlant;
