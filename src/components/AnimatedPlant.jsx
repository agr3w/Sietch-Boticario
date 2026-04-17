import { motion } from "framer-motion";

function AnimatedPlant({ side = "left" }) {
  const isRight = side === "right";

  return (
    <motion.svg
      width="200"
      height="300"
      viewBox="0 0 100 200"
      style={{
        position: "absolute",
        bottom: 0,
        left: isRight ? "auto" : 20,
        right: isRight ? 20 : "auto",
        zIndex: 0,
        opacity: 0.32,
        transform: isRight ? "scaleX(-1)" : "none",
        pointerEvents: "none",
      }}
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d="M50 200 Q50 100 80 50"
        stroke="#6B8E23"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      <motion.ellipse
        cx="80"
        cy="50"
        rx="10"
        ry="20"
        fill="#4A7A2F"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 5, 0] }}
        transition={{
          delay: 1.5,
          duration: 1,
          rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
        }}
      />
    </motion.svg>
  );
}

export default AnimatedPlant;
