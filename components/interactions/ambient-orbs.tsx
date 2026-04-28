"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AmbientOrbs() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(115,224,169,0.18),_rgba(115,224,169,0)_68%)] blur-3xl"
        animate={
          reducedMotion
            ? undefined
            : { x: [0, 24, -8, 0], y: [0, 18, 28, 0], scale: [1, 1.06, 0.98, 1] }
        }
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-16rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(127,174,255,0.16),_rgba(127,174,255,0)_70%)] blur-3xl"
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, -18, 12, 0],
                y: [0, -12, -28, 0],
                scale: [1, 0.96, 1.04, 1],
              }
        }
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,9,13,0)_0%,rgba(7,9,13,0.14)_35%,rgba(7,9,13,0.42)_100%)]" />
    </div>
  );
}
