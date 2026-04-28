export type ThoughtTransitionMode =
  | "step"
  | "shuffle"
  | "deckSlide"
  | "rolodexFlip"
  | "cardFan"
  | "verticalIndex"
  | "softFade"
  | "signalSnap";

type RolodexCardPose = {
  opacity: number;
  rotateX: number;
  scale: number;
  y: number;
  zIndex: number;
  previewOpacity: number;
};

const reducedMotionPoses: Record<number, RolodexCardPose> = {
  [-2]: { opacity: 0, rotateX: 0, scale: 0.96, y: -28, zIndex: 1, previewOpacity: 0 },
  [-1]: { opacity: 0.22, rotateX: 10, scale: 0.97, y: -18, zIndex: 2, previewOpacity: 0.32 },
  0: { opacity: 1, rotateX: 0, scale: 1, y: 0, zIndex: 6, previewOpacity: 1 },
  1: { opacity: 0.22, rotateX: -10, scale: 0.97, y: 18, zIndex: 2, previewOpacity: 0.32 },
  2: { opacity: 0, rotateX: 0, scale: 0.96, y: 28, zIndex: 1, previewOpacity: 0 },
};

const defaultPoses: Record<number, RolodexCardPose> = {
  [-2]: { opacity: 0.18, rotateX: 63, scale: 0.84, y: -126, zIndex: 1, previewOpacity: 0.2 },
  [-1]: { opacity: 0.46, rotateX: 36, scale: 0.92, y: -62, zIndex: 3, previewOpacity: 0.42 },
  0: { opacity: 1, rotateX: 0, scale: 1, y: 0, zIndex: 6, previewOpacity: 1 },
  1: { opacity: 0.48, rotateX: -36, scale: 0.92, y: 66, zIndex: 3, previewOpacity: 0.42 },
  2: { opacity: 0.18, rotateX: -63, scale: 0.84, y: 132, zIndex: 1, previewOpacity: 0.2 },
};

const hiddenPose: RolodexCardPose = {
  opacity: 0,
  rotateX: 0,
  scale: 0.8,
  y: 0,
  zIndex: 0,
  previewOpacity: 0,
};

export function getRolodexCardPose(
  offset: number,
  reducedMotion: boolean,
): RolodexCardPose {
  const roundedOffset = Math.max(-2, Math.min(2, offset));
  const poses = reducedMotion ? reducedMotionPoses : defaultPoses;

  return poses[roundedOffset] ?? hiddenPose;
}

export function getRolodexTransition(
  mode: ThoughtTransitionMode,
  reducedMotion: boolean,
) {
  const normalizedMode = mode === "shuffle" ? "shuffle" : "step";

  if (reducedMotion) {
    return {
      duration: normalizedMode === "shuffle" ? 0.16 : 0.24,
      ease: [0.22, 1, 0.36, 1] as const,
    };
  }

  if (normalizedMode === "shuffle") {
    return {
      type: "spring" as const,
      stiffness: 250,
      damping: 24,
      mass: 0.72,
    };
  }

  return {
    type: "spring" as const,
    stiffness: 165,
    damping: 18,
    mass: 0.92,
  };
}

export function pickThoughtTransition(
  previous: ThoughtTransitionMode,
  reducedMotion: boolean,
): ThoughtTransitionMode {
  if (reducedMotion) {
    return "step";
  }

  return previous === "shuffle" ? "step" : "shuffle";
}

export function getThoughtTransition(
  mode: ThoughtTransitionMode,
  direction: 1 | -1,
  reducedMotion: boolean,
) {
  const sign = direction >= 0 ? 1 : -1;
  const transition = getRolodexTransition(mode, reducedMotion);

  if (reducedMotion) {
    return {
      initial: { opacity: 0, scale: 0.985, y: 8 * sign },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.985, y: -8 * sign },
      transition,
    };
  }

  return {
    initial: { opacity: 0.3, rotateX: 20 * sign, scale: 0.94, y: 48 * sign },
    animate: { opacity: 1, rotateX: 0, scale: 1, y: 0 },
    exit: { opacity: 0.3, rotateX: -18 * sign, scale: 0.94, y: -44 * sign },
    transition,
  };
}
