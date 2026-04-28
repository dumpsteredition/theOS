export type FeedbackPrankMode =
  | "autoCorrect"
  | "buttonRunsAway"
  | "buttonHides"
  | "starsArgueBack"
  | "fakeValidation"
  | "selfPreservation"
  | "buttonCopySpiral"
  | "integrityCheck";

export const feedbackPrankModes: FeedbackPrankMode[] = [
  "autoCorrect",
  "buttonRunsAway",
  "buttonHides",
  "starsArgueBack",
  "fakeValidation",
  "selfPreservation",
  "buttonCopySpiral",
  "integrityCheck",
];

export const feedbackSuccessMessages = [
  "Feedback received. Excellent judgment.",
  "Five stars logged. System operating as expected.",
  "The system appreciates your honesty.",
] as const;

export const runawayButtonPositions = [
  { x: 0, y: 0 },
  { x: 88, y: -14 },
  { x: -76, y: 20 },
  { x: 62, y: 26 },
  { x: -54, y: -18 },
] as const;

export const spiralButtonLabels = [
  "Are you sure?",
  "Let's not do this.",
  "I believe in you.",
  "Submit 5-star feedback",
] as const;

export function pickFeedbackPrankMode(
  previousMode?: FeedbackPrankMode | null,
): FeedbackPrankMode {
  const availableModes =
    previousMode && feedbackPrankModes.length > 1
      ? feedbackPrankModes.filter((mode) => mode !== previousMode)
      : feedbackPrankModes;

  const nextIndex = Math.floor(Math.random() * availableModes.length);
  return availableModes[nextIndex];
}

export function pickFeedbackSuccessMessage() {
  const nextIndex = Math.floor(Math.random() * feedbackSuccessMessages.length);
  return feedbackSuccessMessages[nextIndex];
}
