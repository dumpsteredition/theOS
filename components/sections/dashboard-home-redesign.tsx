"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  BrainCircuit,
  ChevronDown,
  Compass,
  HeartPulse,
  LayoutGrid,
  MessageSquareText,
  ScanSearch,
  Scale,
  Target,
  UserRound,
  Workflow,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  profileContent,
} from "@/data/site-content";

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const },
};

const defaultGlowTransition = {
  duration: 2.6,
  repeat: Number.POSITIVE_INFINITY,
  ease: "easeInOut" as const,
};

function getDefaultGlowAnimation<T extends Record<string, unknown>>(
  reducedMotion: boolean,
  animate: T,
  duration = defaultGlowTransition.duration,
  delay = 0,
) {
  if (reducedMotion) {
    return {};
  }

  return {
    animate,
    transition: {
      ...defaultGlowTransition,
      duration,
      delay,
    },
  };
}

const heroFocusPills = [
  {
    label: "Product Strategy",
    icon: Target,
    color: "#93b8ff",
    background: "rgba(147,184,255,0.14)",
    border: "rgba(147,184,255,0.26)",
    glow: "rgba(147,184,255,0.18)",
    text: "#dce9ff",
  },
  {
    label: "UX Systems",
    icon: LayoutGrid,
    color: "#7ee0cf",
    background: "rgba(126,224,207,0.14)",
    border: "rgba(126,224,207,0.24)",
    glow: "rgba(126,224,207,0.16)",
    text: "#d9fff8",
  },
  {
    label: "Artificial Intelligence",
    icon: BrainCircuit,
    color: "#9b8cff",
    background: "rgba(155,140,255,0.14)",
    border: "rgba(155,140,255,0.24)",
    glow: "rgba(155,140,255,0.18)",
    text: "#ece8ff",
  },
] as const;

const heroActions = [
  {
    label: "Start Conversation",
    href: "/inbox",
    icon: MessageSquareText,
    tone: "contained" as const,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
    tone: "floating" as const,
  },
];

const growthStartYear = 2004;
const growthCurrentYear = new Date().getFullYear();
const growthYears = Array.from(
  { length: growthCurrentYear - growthStartYear + 1 },
  (_, index) => `${growthStartYear + index}`,
);

const growthSeries = [
  {
    label: "Product Strategy",
    color: "#93b8ff",
    values: [2, 3, 4, 5, 7, 8, 10, 12, 15, 18, 22, 27, 33, 40, 47, 54, 61, 68, 74, 80, 85, 89, 92],
    note: "Problem framing, tradeoffs, scope discipline.",
    focus:
      "Clarifies the real problem, narrows the useful scope, and helps teams make decisions that survive real constraints.",
    inflection:
      "The curve steepens once the work shifts from feature delivery into product direction and harder tradeoff calls.",
    impact:
      "Shows up best when a team needs sharper priorities, stronger sequencing, and less roadmap theater.",
  },
  {
    label: "UX / Systems Design",
    color: "#7ee0cf",
    values: [1, 2, 3, 4, 5, 6, 8, 10, 13, 16, 20, 24, 29, 35, 42, 49, 57, 64, 71, 77, 82, 87, 90],
    note: "Workflow structure, hierarchy, interaction clarity.",
    focus:
      "Turns dense product surfaces into flows, states, and hierarchy that feel calmer without hiding complexity.",
    inflection:
      "Grows with every product that needed better structure, clearer behavior, and less user hesitation.",
    impact:
      "Most useful when a product is technically capable but cognitively expensive to move through.",
  },
  {
    label: "Healthcare AI",
    color: "#9b8cff",
    values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 6, 10, 15, 22, 31, 42, 55, 67, 78, 86, 91],
    note: "Explainability, trust, clinical workflow fit.",
    focus:
      "Centers explainability, trust, model behavior, and the product decisions that let AI fit real clinical work.",
    inflection:
      "Starts later, then ramps quickly as AI becomes a core part of the product environment instead of a side feature.",
    impact:
      "Best when AI features need to be legible enough to trust, challenge, and act on.",
  },
  {
    label: "Workflow Design",
    color: "#ffae70",
    values: [3, 4, 5, 6, 7, 9, 11, 13, 16, 20, 24, 29, 35, 42, 49, 57, 64, 71, 77, 82, 87, 90, 93],
    note: "Operational flow, friction removal, action paths.",
    focus:
      "Maps how work actually moves, where decisions stall, and what friction needs to disappear for progress to happen.",
    inflection:
      "Rises steadily because almost every product problem eventually turns into a workflow problem.",
    impact:
      "Useful when teams know the feature list but not how the work should really move from one step to the next.",
  },
  {
    label: "Commercial Thinking",
    color: "#d9dbff",
    values: [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 19, 24, 30, 36, 43, 50, 57, 63, 69, 75, 81, 85, 89],
    note: "Constraints, prioritization, execution reality.",
    focus:
      "Balances user value, business pressure, stakeholder needs, and what can actually ship without collapsing the plan.",
    inflection:
      "Builds alongside product work as business pressure becomes harder to ignore and more important to translate.",
    impact:
      "Strongest when user value, viability, and execution reality all need to fit inside the same decision.",
  },
] as const;

type OperatingLane = {
  id: string;
  title: string;
  summary: string;
  emphasis: string;
  width: string;
  lineColor: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tint: string;
  glow: string;
  bestFor: string;
  watchFor: string;
  output: string;
};

const operatingLanes = [
  {
    id: "product-strategy",
    title: "Product Strategy",
    summary: "Find the real problem, sharpen scope, and keep the plan alive once reality arrives.",
    emphasis: "Problem framing",
    width: "84%",
    lineColor: "#93b8ff",
    icon: Target,
    tint: "rgba(147,184,255,0.18)",
    glow: "rgba(147,184,255,0.08)",
    bestFor: "Ambiguous problems, messy scope, and roadmap pressure.",
    watchFor: "Teams solving symptoms instead of constraints.",
    output: "Clearer tradeoffs, sharper sequencing, and fewer fake priorities.",
  },
  {
    id: "ux-systems-design",
    title: "UX / Systems Design",
    summary: "Turn dense product surfaces into flows, states, and hierarchy people can actually trust.",
    emphasis: "Structure over ornament",
    width: "100%",
    lineColor: "#7ee0cf",
    icon: LayoutGrid,
    tint: "rgba(126,224,207,0.17)",
    glow: "rgba(126,224,207,0.08)",
    bestFor: "Complex interfaces, decision-heavy workflows, and system states.",
    watchFor: "Screens that look clean but still make people think too hard.",
    output: "Clearer paths, stronger hierarchy, and less cognitive friction.",
  },
  {
    id: "healthcare-ai",
    title: "Healthcare AI",
    summary: "Design trust-sensitive systems where explainability, confidence, and workflow fit are product requirements.",
    emphasis: "Trust-sensitive judgment",
    width: "72%",
    lineColor: "#9b8cff",
    icon: HeartPulse,
    tint: "rgba(155,140,255,0.16)",
    glow: "rgba(155,140,255,0.08)",
    bestFor: "AI-assisted workflows, clinical context, and model-facing UX.",
    watchFor: "Smart outputs that users cannot understand or act on.",
    output: "Usable confidence, clearer evidence, and better trust moments.",
  },
  {
    id: "workflow-design",
    title: "Workflow Design",
    summary: "Map how work really moves, then remove the friction that slows decisions down.",
    emphasis: "Operational usability",
    width: "88%",
    lineColor: "#ffae70",
    icon: Workflow,
    tint: "rgba(255,174,112,0.16)",
    glow: "rgba(255,174,112,0.08)",
    bestFor: "Operational workflows, handoffs, and multi-step decisions.",
    watchFor: "Process pretending to be progress.",
    output: "Fewer dead zones, cleaner transitions, and faster action.",
  },
  {
    id: "commercial-thinking",
    title: "Commercial Thinking",
    summary: "Balance user value, business pressure, and shipping constraints without hiding behind process theater.",
    emphasis: "Useful tradeoffs",
    width: "76%",
    lineColor: "#d9dbff",
    icon: Scale,
    tint: "rgba(217,219,255,0.14)",
    glow: "rgba(217,219,255,0.08)",
    bestFor: "Product tradeoffs, prioritization, and go-to-market reality.",
    watchFor: "Beautiful ideas that cannot survive the business model.",
    output: "Useful scope, viable bets, and decisions that can actually ship.",
  },
] as const satisfies readonly OperatingLane[];

const workingPrinciples = [
  {
    index: "01",
    title: "Start with the real problem.",
    detail:
      "Do not solve the visible mess until you understand what is actually broken.",
    accent: "#93b8ff",
    border: "rgba(147,184,255,0.18)",
    glow: "rgba(147,184,255,0.12)",
    badge: "rgba(147,184,255,0.16)",
  },
  {
    index: "02",
    title: "Make complexity usable.",
    detail:
      "The goal is not to pretend complex work is simple. The goal is to make it navigable.",
    accent: "#7ee0cf",
    border: "rgba(126,224,207,0.18)",
    glow: "rgba(126,224,207,0.12)",
    badge: "rgba(126,224,207,0.16)",
  },
  {
    index: "03",
    title: "Protect the outcome.",
    detail:
      "Process is useful only when it helps the team make better decisions and ship the right thing.",
    accent: "#b0b8d9",
    border: "rgba(176,184,217,0.18)",
    glow: "rgba(176,184,217,0.11)",
    badge: "rgba(176,184,217,0.15)",
  },
  {
    index: "04",
    title: "Ship the smallest useful version.",
    detail:
      "Get the useful version into reality, then sharpen it with evidence.",
    accent: "#ffb86d",
    border: "rgba(255,184,109,0.18)",
    glow: "rgba(255,184,109,0.11)",
    badge: "rgba(255,184,109,0.15)",
  },
] as const;

const snapshotStatCards = [
  {
    value: "5",
    label: "Core skill tracks",
    accent: "#8eb7ff",
    glow: "rgba(142,183,255,0.22)",
    highlight: "rgba(142,183,255,0.18)",
    sheen: "rgba(220,235,255,0.2)",
    Illustration: SkillTracksIllustration,
    underlayClassName: "absolute -right-4 top-1.5 h-[54px] w-[54px]",
    overlayClassName: "absolute -right-2 -top-3 h-[60px] w-[60px]",
    underlayRest: { x: 18, y: 10, rotate: 10, scale: 0.88, opacity: 0 },
    underlayActive: {
      x: [18, 6, 2],
      y: [10, -4, -8],
      rotate: [10, -5, -6],
      scale: [0.88, 1.03, 1],
      opacity: [0, 0.86, 0.78],
    },
    overlayRest: { x: 14, y: 18, rotate: 8, scale: 0.88, opacity: 0 },
    overlayActive: {
      x: [14, -6, -4],
      y: [18, -12, -10],
      rotate: [8, -8, -6],
      scale: [0.88, 1.05, 1],
      opacity: [0, 1, 1],
    },
    floatActive: { y: [0, -0.8, 0], rotate: [0, -0.4, 0], scale: [1, 1.01, 1] },
    floatTransition: {
      duration: 3.2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
  },
  {
    value: "23+",
    label: "Years experience",
    accent: "#f2c76f",
    glow: "rgba(242,199,111,0.18)",
    highlight: "rgba(242,199,111,0.16)",
    sheen: "rgba(255,241,202,0.18)",
    Illustration: ExperienceTimepieceIllustration,
    underlayClassName: "absolute -right-3 top-2 h-[52px] w-[52px]",
    overlayClassName: "absolute -right-1 -top-2 h-[58px] w-[58px]",
    underlayRest: { x: 18, y: 12, rotate: 12, scale: 0.86, opacity: 0 },
    underlayActive: {
      x: [18, 7, 3],
      y: [12, -2, -5],
      rotate: [12, 4, 6],
      scale: [0.86, 1.02, 1],
      opacity: [0, 0.82, 0.76],
    },
    overlayRest: { x: 14, y: 18, rotate: 14, scale: 0.86, opacity: 0 },
    overlayActive: {
      x: [14, -5, -3],
      y: [18, -9, -7],
      rotate: [14, 7, 9],
      scale: [0.86, 1.04, 1],
      opacity: [0, 1, 1],
    },
    floatActive: {
      rotate: [0, 1.5, -1.2, 0.7, 0],
      y: [0, -0.4, 0.25, 0],
      scale: [1, 1.01, 1],
    },
    floatTransition: {
      duration: 2.3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
  },
  {
    value: "50+",
    label: "Secondary skills",
    accent: "#7ee0cf",
    glow: "rgba(126,224,207,0.2)",
    highlight: "rgba(126,224,207,0.16)",
    sheen: "rgba(225,255,247,0.18)",
    Illustration: SecondarySkillsBurstIllustration,
    underlayClassName: "absolute -right-4 top-2 h-[52px] w-[52px]",
    overlayClassName: "absolute -right-2 -top-2 h-[58px] w-[58px]",
    underlayRest: { x: 18, y: 12, rotate: 8, scale: 0.86, opacity: 0 },
    underlayActive: {
      x: [18, 6, 2],
      y: [12, 0, -4],
      rotate: [8, -2, -1],
      scale: [0.86, 1.04, 1],
      opacity: [0, 0.88, 0.82],
    },
    overlayRest: { x: 14, y: 16, rotate: 10, scale: 0.86, opacity: 0 },
    overlayActive: {
      x: [14, -6, -4],
      y: [16, -8, -6],
      rotate: [10, -4, -2],
      scale: [0.86, 1.08, 1],
      opacity: [0, 1, 1],
    },
    floatActive: {
      y: [0, -1.7, 0],
      rotate: [0, -1.1, 0.8, 0],
      scale: [1, 1.018, 1],
    },
    floatTransition: {
      duration: 2.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
  },
  {
    value: "Top 5%",
    label: "Speed & proficiency",
    accent: "#ffb95e",
    glow: "rgba(255,185,94,0.22)",
    highlight: "rgba(255,185,94,0.18)",
    sheen: "rgba(255,231,196,0.18)",
    Illustration: CrownAchievementIllustration,
    underlayClassName: "absolute -right-3 top-2 h-[54px] w-[54px]",
    overlayClassName: "absolute -right-1.5 -top-2 h-[60px] w-[60px]",
    underlayRest: { x: 16, y: 12, rotate: 10, scale: 0.86, opacity: 0 },
    underlayActive: {
      x: [16, 6, 2],
      y: [12, 0, -3],
      rotate: [10, -8, -6],
      scale: [0.86, 1.03, 1],
      opacity: [0, 0.9, 0.84],
    },
    overlayRest: { x: 14, y: 15, rotate: 12, scale: 0.86, opacity: 0 },
    overlayActive: {
      x: [14, -4, -3],
      y: [15, -10, -8],
      rotate: [12, -11, -8],
      scale: [0.86, 1.08, 1],
      opacity: [0, 1, 1],
    },
    floatActive: {
      y: [0, -1.1, 0],
      rotate: [0, -1.6, 0.7, 0],
      scale: [1, 1.02, 1],
    },
    floatTransition: {
      duration: 2.35,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut" as const,
    },
  },
] as const;

const linkedInProfilePort = {
  href: "https://www.linkedin.com/in/kylebrumbley/",
  name: "Kyle Brumbley",
  location: "Jacksonville, Florida, United States",
  connections: "500+ connections",
  headline: "Product Leader",
  company: "Lucem Health",
  summary:
    "Product Leader | Building healthcare AI products that drive action, not just insight",
  mentorship: "Designed.org",
};

const linkedInBannerWaves = {
  top: [
    "M0 66 C78 24 138 88 220 54 C302 20 372 94 456 52 C510 24 548 36 600 12 L600 120 L0 120 Z",
    "M0 56 C78 42 138 68 220 67 C302 38 372 74 456 65 C510 42 548 28 600 24 L600 120 L0 120 Z",
    "M0 77 C78 4 138 108 220 38 C302 2 372 114 456 36 C510 6 548 50 600 0 L600 120 L0 120 Z",
    "M0 66 C78 24 138 88 220 54 C302 20 372 94 456 52 C510 24 548 36 600 12 L600 120 L0 120 Z",
  ],
  middle: [
    "M0 82 C82 50 152 104 236 74 C316 44 396 98 474 66 C530 42 564 56 600 42 L600 120 L0 120 Z",
    "M0 72 C82 70 152 84 236 89 C316 60 396 82 474 81 C530 60 564 46 600 58 L600 120 L0 120 Z",
    "M0 93 C82 30 152 120 236 56 C316 24 396 114 474 52 C530 24 564 70 600 30 L600 120 L0 120 Z",
    "M0 82 C82 50 152 104 236 74 C316 44 396 98 474 66 C530 42 564 56 600 42 L600 120 L0 120 Z",
  ],
  bottom: [
    "M0 96 C92 74 180 118 262 92 C352 64 420 112 504 84 C548 70 574 76 600 72 L600 120 L0 120 Z",
    "M0 86 C92 92 180 102 262 105 C352 80 420 98 504 97 C548 84 574 68 600 86 L600 120 L0 120 Z",
    "M0 107 C92 56 180 130 262 76 C352 46 420 126 504 70 C548 54 574 90 600 58 L600 120 L0 120 Z",
    "M0 96 C92 74 180 118 262 92 C352 64 420 112 504 84 C548 70 574 76 600 72 L600 120 L0 120 Z",
  ],
} as const;

const chartWidth = 960;
const chartHeight = 408;
const chartPadding = { top: 24, right: 178, bottom: 44, left: 60 };

export function DashboardHomeRedesign() {
  const reducedMotion = useReducedMotion();
  const [activeGrowthSeries, setActiveGrowthSeries] = useState<string>(growthSeries[0].label);
  const [activeCapabilityId, setActiveCapabilityId] = useState<string | null>(null);
  const [previewCapabilityId, setPreviewCapabilityId] = useState<string | null>(null);
  const activeCapability = operatingLanes.find((lane) => lane.id === activeCapabilityId) ?? null;
  const previewCapability = operatingLanes.find((lane) => lane.id === previewCapabilityId) ?? null;
  const linkedGrowthSeriesLabel =
    previewCapability?.title ?? activeCapability?.title ?? activeGrowthSeries;
  const highlightedGrowthSeries =
    growthSeries.find((series) => series.label === linkedGrowthSeriesLabel) ?? growthSeries[0];

  return (
    <section className="space-y-9 pb-12 xl:space-y-11">
      <motion.section
        {...sectionMotion}
        className="luxe-panel relative overflow-hidden rounded-[2.5rem] px-5 py-6 sm:px-7 sm:py-7 xl:px-10 xl:py-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(155,176,226,0.24),transparent_30%),radial-gradient(circle_at_92%_12%,rgba(72,92,141,0.24),transparent_24%),radial-gradient(circle_at_56%_100%,rgba(39,56,92,0.18),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_30%)]"
        />
          <div className="dashboard-hero-layout relative grid gap-8">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center gap-2.5">
                {heroFocusPills.map((pill) => (
                  <HeroFocusPill key={pill.label} pill={pill} />
                ))}
              </div>

            <div className="max-w-5xl space-y-5">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/34">
                Kyle Brumbley
              </p>
              <h1 className="max-w-5xl text-[clamp(2.65rem,6.4vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white">
                Making complex products easier to use.
              </h1>
              <p className="max-w-3xl text-[1.08rem] leading-8 text-[color:var(--text-soft)] sm:text-[1.45rem] sm:leading-9">
                Kyle works across product strategy, UX systems, healthcare AI, and workflow
                design to turn messy products and complex workflows into clearer decisions,
                sharper experiences, and software people can actually use.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5">
              {heroActions.map((action) => (
                <HeroLink
                  key={action.label}
                  href={action.href}
                  label={action.label}
                  icon={action.icon}
                  tone={action.tone}
                />
              ))}
            </div>

          </div>

          <aside className="space-y-5">
            <section className="luxe-panel-soft relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(97,123,185,0.18),transparent_38%)]"
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/34">
                    Professional Profile
                  </p>
                  <div className="flex items-center gap-2 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[color:var(--accent-strong)] shadow-[0_0_18px_rgba(115,224,169,0.08)]">
                    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                      {reducedMotion ? null : (
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--accent)] opacity-45 blur-[1px] animate-ping" />
                      )}
                      <span
                        className={
                          reducedMotion
                            ? "relative h-2.5 w-2.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_10px_rgba(115,224,169,0.45)]"
                            : "relative h-2.5 w-2.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_14px_rgba(115,224,169,0.65)] animate-pulse"
                        }
                      />
                    </span>
                    Live
                  </div>
                </div>

                <LinkedInProfilePort />
              </div>
            </section>

          </aside>
        </div>
      </motion.section>

      <motion.section
        {...sectionMotion}
        transition={{ ...sectionMotion.transition, delay: 0.05 }}
        className="space-y-5"
      >
        <div className="artifact-screen overflow-hidden rounded-[2.4rem] px-4 py-5 sm:px-6 sm:py-6 xl:px-7 xl:py-7">
          <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.16fr)_330px]">
            <GrowthChart
              activeSeriesLabel={linkedGrowthSeriesLabel}
              onSeriesChange={setActiveGrowthSeries}
            />
            <aside className="grid h-full content-start gap-4">
              <section className="rounded-[1.7rem] border border-white/8 bg-black/16 p-4">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                  Capability snapshot
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {snapshotStatCards.map((card) => (
                    <SnapshotStat key={card.label} {...card} />
                  ))}
                </div>
              </section>

              <section className="rounded-[1.7rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,12,19,0.86))] p-4">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                  Legend
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
                  {growthSeries.map((series) => (
                    <button
                      key={series.label}
                      type="button"
                      onMouseEnter={() => setActiveGrowthSeries(series.label)}
                      onFocus={() => setActiveGrowthSeries(series.label)}
                      onClick={() => setActiveGrowthSeries(series.label)}
                      className={`inline-flex items-center gap-2.5 text-left text-sm font-medium transition duration-[var(--motion-base)] ${
                        linkedGrowthSeriesLabel === series.label
                          ? "text-white"
                          : "text-white/72 hover:text-white"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
                        style={{ color: series.color, backgroundColor: series.color }}
                      />
                      <span>{series.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.7rem] border border-white/8 bg-black/18 p-4">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                  Active read
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
                  Hover or click on an item in the legend to learn more.
                </p>
                <div className="mt-4 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
                      style={{
                        color: highlightedGrowthSeries.color,
                        backgroundColor: highlightedGrowthSeries.color,
                      }}
                    />
                    <p className="text-sm font-semibold text-white">
                      {highlightedGrowthSeries.label}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
                    {highlightedGrowthSeries.focus}
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </motion.section>

      <motion.section
        {...sectionMotion}
        transition={{ ...sectionMotion.transition, delay: 0.09 }}
        className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
      >
        <section className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/34">
              WHAT I DO
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-white sm:text-[2.35rem]">
              Product work for complex systems.
            </h2>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(28,35,52,0.42),rgba(8,12,19,0.94))] p-5 shadow-[0_28px_72px_rgba(0,0,0,0.24)] sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricSurface
                label="Current Focus"
                value="Complex product decisions"
                detail="Framing the real problem, clarifying the workflow, and helping teams make sharper decisions under real constraints."
                icon={Target}
                accent="rgba(147,184,255,0.22)"
                iconPosition="right-[-12px] top-1/2 -translate-y-1/2"
              />
              <MetricSurface
                label="Best Fit"
                value="Messy, high-stakes systems"
                detail="Healthcare AI, analytics, internal tools, and product surfaces where trust, clarity, and execution all matter."
                icon={ScanSearch}
                accent="rgba(126,224,207,0.2)"
                iconPosition="right-[-10px] top-1/2 -translate-y-1/2"
              />
            </div>

            <ExpandablePrinciplesCard />
          </div>
        </section>

        <section className="space-y-4">
          {operatingLanes.map((lane) => (
            <OperatingLane
              key={lane.id}
              lane={lane}
              isExpanded={activeCapabilityId === lane.id}
              onToggle={() => {
                setActiveCapabilityId((currentId) => (currentId === lane.id ? null : lane.id));
                setActiveGrowthSeries(lane.title);
              }}
              onPreviewChange={setPreviewCapabilityId}
            />
          ))}
        </section>
      </motion.section>

    </section>
  );
}

function GrowthChart({
  activeSeriesLabel,
  onSeriesChange,
}: {
  activeSeriesLabel: string;
  onSeriesChange: (label: string) => void;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const yTicks = [0, 20, 40, 60, 80, 100];
  const xStep =
    (chartWidth - chartPadding.left - chartPadding.right) / (growthYears.length - 1);
  const yRange = chartHeight - chartPadding.top - chartPadding.bottom;

  const seriesWithPoints = growthSeries.map((series) => {
    const points = series.values.map((value, index) => ({
      x: chartPadding.left + index * xStep,
      y: chartHeight - chartPadding.bottom - (value / 100) * yRange,
      value,
    }));

    return {
      ...series,
      points,
      path: buildSmoothPath(points),
    };
  });
  const activeSeries =
    seriesWithPoints.find((series) => series.label === activeSeriesLabel) ?? seriesWithPoints[0];
  const renderedSeries = [
    ...seriesWithPoints.filter((series) => series.label !== activeSeries.label),
    activeSeries,
  ];
  const activeLastPoint = activeSeries.points[activeSeries.points.length - 1];
  const endpointLabelWidth = 154;
  const endpointLabelX = Math.min(
    activeLastPoint.x + 20,
    chartWidth - endpointLabelWidth - 8,
  );
  const endpointLabelY = clamp(activeLastPoint.y - 20, chartPadding.top + 8, chartHeight - chartPadding.bottom - 42);
  const activeSeriesStartedYear =
    growthYears[activeSeries.values.findIndex((value) => value > 0)] ?? growthYears[0];

  return (
    <div className="relative flex h-full min-h-[680px] flex-col overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(15,20,31,0.9),rgba(8,11,18,0.98))] p-3 sm:p-4">
      <div className="mb-4 flex flex-col gap-4 pl-3 pt-3 sm:mb-5 sm:pl-4 sm:pt-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/34">
            Capability Growth
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.06em] text-white sm:text-[2.45rem]">
            The skill stack behind the work.
          </h2>
        </div>
      </div>

      <div className="relative flex-1 overflow-x-auto">
        <motion.div
          key={activeSeries.label}
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute right-3 top-3 z-10 w-[240px] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(24,31,47,0.94),rgba(9,13,21,0.98))] p-4 shadow-[0_22px_44px_rgba(0,0,0,0.28)] backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <motion.span
                  className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
                  style={{
                    color: activeSeries.color,
                    backgroundColor: activeSeries.color,
                  }}
                  {...getDefaultGlowAnimation(
                    reducedMotion,
                    {
                      scale: [1, 1.18, 1],
                      opacity: [0.88, 1, 0.9],
                      boxShadow: [
                        `0 0 10px ${activeSeries.color}55`,
                        `0 0 18px ${activeSeries.color}88`,
                        `0 0 10px ${activeSeries.color}55`,
                      ],
                    },
                    1.9,
                  )}
                />
                <p className="text-sm font-semibold text-white">{activeSeries.label}</p>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/38">
                Active since {activeSeriesStartedYear}
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                color: activeSeries.color,
                backgroundColor: `${activeSeries.color}16`,
                border: `1px solid ${activeSeries.color}2f`,
              }}
            >
              {activeSeries.values[activeSeries.values.length - 1]}%
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/78">{activeSeries.focus}</p>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
            {activeSeries.inflection}
          </p>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
            {activeSeries.impact}
          </p>
        </motion.div>

        <svg
          role="img"
          aria-label={`Multi-series chart showing growth in product strategy, UX and systems design, healthcare AI, workflow design, and commercial thinking from ${growthStartYear} through ${growthCurrentYear}.`}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-full min-h-[560px] min-w-[920px] w-full"
        >
          <defs>
            {seriesWithPoints.map((series) => (
              <filter
                key={`glow-${series.label}`}
                id={series.label.replaceAll(/[^a-zA-Z0-9]/g, "")}
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
          </defs>

          <rect
            x="0"
            y="0"
            width={chartWidth}
            height={chartHeight}
            rx="22"
            fill="rgba(8,12,19,0.56)"
          />

          {yTicks.map((tick) => {
            const y = chartHeight - chartPadding.bottom - (tick / 100) * yRange;

            return (
              <g key={tick}>
                <line
                  x1={chartPadding.left}
                  y1={y}
                  x2={chartWidth - chartPadding.right + 12}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray={tick === 0 ? undefined : "4 8"}
                />
                <text
                  x={chartPadding.left - 16}
                  y={y + 5}
                  textAnchor="end"
                  fontSize="12"
                  fill="rgba(255,255,255,0.48)"
                  fontFamily="var(--font-jetbrains-mono)"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {growthYears.map((year, index) => {
            const x = chartPadding.left + index * xStep;
            const showLabel =
              index === 0 ||
              index === growthYears.length - 1 ||
              (Number(year) - growthStartYear) % 2 === 0;

            return (
              <g key={year}>
                <line
                  x1={x}
                  y1={chartHeight - chartPadding.bottom}
                  x2={x}
                  y2={chartHeight - chartPadding.bottom + (showLabel ? 8 : 4)}
                  stroke="rgba(255,255,255,0.14)"
                />
                {showLabel ? (
                  <text
                    x={x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fill="rgba(255,255,255,0.48)"
                    fontFamily="var(--font-jetbrains-mono)"
                  >
                    {year}
                  </text>
                ) : null}
              </g>
            );
          })}

          {renderedSeries.map((series) => {
            const filterId = series.label.replaceAll(/[^a-zA-Z0-9]/g, "");
            const isActive = series.label === activeSeries.label;

            return (
              <g key={series.label}>
                <motion.path
                  d={series.path}
                  fill="none"
                  stroke={series.color}
                  strokeWidth={isActive ? 11 : 8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isActive ? 0.22 : 0.04}
                  filter={`url(#${filterId})`}
                  style={
                    isActive
                      ? {
                          filter: `url(#${filterId}) drop-shadow(0 0 12px ${series.color}66)`,
                        }
                      : undefined
                  }
                  {...(isActive
                    ? getDefaultGlowAnimation(
                        reducedMotion,
                        {
                          opacity: [0.18, 0.34, 0.2],
                          strokeWidth: [10, 13, 10],
                        },
                        2.2,
                      )
                    : {})}
                />
                <motion.path
                  d={series.path}
                  fill="none"
                  stroke={series.color}
                  strokeWidth={isActive ? 4.2 : 2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isActive ? 1 : 0.28}
                  {...(isActive
                    ? getDefaultGlowAnimation(
                        reducedMotion,
                        {
                          opacity: [0.88, 1, 0.92],
                          strokeWidth: [3.7, 4.5, 3.7],
                        },
                        2.2,
                        0.1,
                      )
                    : {})}
                />
                <path
                  d={series.path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={18}
                  strokeLinecap="round"
                  onMouseEnter={() => onSeriesChange(series.label)}
                  onFocus={() => onSeriesChange(series.label)}
                />
                {series.points.map((point, index) => (
                  <motion.circle
                    key={`${series.label}-${point.x}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={
                      index === series.points.length - 1
                        ? isActive
                          ? 5.3
                          : 3.5
                        : isActive && (index === 0 || index % 4 === 0)
                          ? 3
                          : 0
                    }
                    fill={series.color}
                    opacity={
                      index === series.points.length - 1
                        ? isActive
                          ? 1
                          : 0.34
                        : 0.9
                    }
                    {...(isActive && index === series.points.length - 1
                      ? getDefaultGlowAnimation(
                          reducedMotion,
                          {
                            r: [5.2, 6.4, 5.2],
                            opacity: [0.9, 1, 0.92],
                          },
                          1.9,
                        )
                      : {})}
                  />
                ))}
              </g>
            );
          })}

          <line
            x1={activeLastPoint.x + 8}
            y1={activeLastPoint.y}
            x2={endpointLabelX}
            y2={endpointLabelY + 14}
            stroke={activeSeries.color}
            strokeOpacity={0.45}
            strokeWidth={1.5}
          />
          <rect
            x={endpointLabelX}
            y={endpointLabelY}
            width={endpointLabelWidth}
            height="32"
            rx="14"
            fill="rgba(10,14,22,0.88)"
            stroke={`${activeSeries.color}52`}
          />
          <motion.circle
            cx={endpointLabelX + 14}
            cy={endpointLabelY + 16}
            r={4}
            fill={activeSeries.color}
            {...getDefaultGlowAnimation(
              reducedMotion,
              {
                r: [4, 5.2, 4],
                opacity: [0.92, 1, 0.94],
              },
              2,
            )}
          />
          <text
            x={endpointLabelX + 24}
            y={endpointLabelY + 20}
            fontSize="11"
            fill="rgba(255,255,255,0.92)"
            fontWeight="600"
          >
            {activeSeries.label}
          </text>
        </svg>
      </div>
    </div>
  );
}

function HeroLink({
  href,
  label,
  icon: Icon,
  tone,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "floating" | "contained";
}) {
  return (
    <Link
      href={href}
      className={
        tone === "contained"
          ? "inline-flex items-center gap-2 rounded-2xl border border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] px-4 py-3 text-sm font-medium text-[color:var(--text-soft)] shadow-[0_12px_30px_rgba(98,117,170,0.16)] transition duration-[var(--motion-base)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8eb7ff]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,12,19,0.96)]"
          : "inline-flex items-center gap-2 px-1 py-3 text-sm font-medium text-white/74 transition duration-[var(--motion-base)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8eb7ff]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,12,19,0.96)]"
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function HeroFocusPill({
  pill,
}: {
  pill: (typeof heroFocusPills)[number];
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const Icon = pill.icon;
  const softGlow = pill.glow.replace(/0\.\d+\)$/, "0.3)");
  const strongGlow = pill.glow.replace(/0\.\d+\)$/, "0.5)");

  return (
    <motion.span
      className="group relative inline-flex overflow-hidden rounded-full border px-3.5 py-1.5"
      style={{
        borderColor: pill.border,
        background: `linear-gradient(180deg, ${pill.background}, rgba(10,14,22,0.5))`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.02) inset, 0 6px 14px ${pill.glow}`,
      }}
      animate={
        reducedMotion
          ? undefined
          : {
              boxShadow: [
                `0 0 0 1px rgba(255,255,255,0.02) inset, 0 5px 12px ${pill.glow}`,
                `0 0 0 1px rgba(255,255,255,0.03) inset, 0 7px 16px ${softGlow}`,
                `0 0 0 1px rgba(255,255,255,0.02) inset, 0 5px 12px ${pill.glow}`,
              ],
            }
      }
      transition={
        reducedMotion
          ? undefined
          : {
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }
      }
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `radial-gradient(circle at 22% 34%, ${pill.glow}, transparent 28%)`,
        }}
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [0.42, 0.68, 0.46],
                scale: [0.98, 1.02, 0.99],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 3.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
        }
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full blur-[14px]"
        style={{ backgroundColor: softGlow }}
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [0.2, 0.75, 0.24],
                scale: [0.9, 1.22, 0.94],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 2.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
        }
      />
      <span className="relative flex items-center gap-2.5">
        <motion.span
          className="flex h-5 w-5 items-center justify-center rounded-full border"
          style={{
            borderColor: `${pill.color}3b`,
            backgroundColor: `${pill.color}1f`,
            color: pill.color,
            boxShadow: `0 0 8px ${pill.glow}`,
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    `0 0 6px ${pill.glow}`,
                    `0 0 12px ${strongGlow}`,
                    `0 0 7px ${pill.glow}`,
                  ],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 3.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
          }
        >
          <Icon className="h-3 w-3" strokeWidth={2.15} />
        </motion.span>
        <span
          className="text-[0.69rem] font-semibold uppercase tracking-[0.22em]"
          style={{ color: pill.text }}
        >
          {pill.label}
        </span>
      </span>
    </motion.span>
  );
}

function resolveReducedMotionState(
  state: Record<string, number | readonly number[]>,
): Record<string, number> {
  const reducedState: Record<string, number> = {};

  Object.entries(state).forEach(([key, value]) => {
    reducedState[key] = typeof value === "number" ? value : value[value.length - 1];
  });

  return reducedState;
}

function cloneMotionState(
  state: Record<string, number | readonly number[]>,
): Record<string, number | number[]> {
  const clonedState: Record<string, number | number[]> = {};

  Object.entries(state).forEach(([key, value]) => {
    clonedState[key] = typeof value === "number" ? value : [...value];
  });

  return clonedState;
}

function SnapshotStat({
  value,
  label,
  accent,
  glow,
  highlight,
  sheen,
  Illustration,
  underlayClassName,
  overlayClassName,
  underlayRest,
  underlayActive,
  overlayRest,
  overlayActive,
  floatActive,
  floatTransition,
}: (typeof snapshotStatCards)[number]) {
  const reducedMotion = Boolean(useReducedMotion());
  const [hovered, setHovered] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [selected, setSelected] = useState(false);
  const isActive = hovered || focusVisible || pressed || selected;
  const revealTransition = isActive
    ? reducedMotion
      ? { duration: 0.22, ease: sectionMotion.transition.ease }
      : {
          duration: 0.58,
          ease: sectionMotion.transition.ease,
          times: [0, 0.68, 1],
        }
    : {
        duration: reducedMotion ? 0.18 : 0.34,
        ease: [0.4, 0, 0.2, 1] as const,
      };

  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      className="group relative isolate w-full appearance-none rounded-[1.15rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/16 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,12,19,0.96)]"
      onClick={() => setSelected((current) => !current)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={(event) => {
        setFocusVisible(event.currentTarget.matches(":focus-visible"));
      }}
      onBlur={() => setFocusVisible(false)}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") {
          setPressed(true);
        }
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[1.15rem]">
        <motion.div
          aria-hidden="true"
          className={underlayClassName}
          animate={
            isActive
              ? reducedMotion
                ? resolveReducedMotionState(underlayActive)
                : cloneMotionState(underlayActive)
              : cloneMotionState(underlayRest)
          }
          transition={revealTransition}
        >
          <Illustration className="h-full w-full" />
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        className={`pointer-events-none absolute z-20 ${overlayClassName}`}
        animate={
          isActive
            ? reducedMotion
              ? resolveReducedMotionState(overlayActive)
              : cloneMotionState(overlayActive)
            : cloneMotionState(overlayRest)
        }
        transition={revealTransition}
      >
        <motion.div
          className="h-full w-full"
          style={{ transformOrigin: "center center" }}
          animate={
            isActive && !reducedMotion
              ? cloneMotionState(floatActive)
              : { y: 0, rotate: 0, scale: 1 }
          }
          transition={
            isActive && !reducedMotion
              ? floatTransition
              : { duration: 0.18, ease: "easeOut" }
          }
        >
          <Illustration className="h-full w-full" />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 overflow-hidden rounded-[1.15rem] border border-white/8 bg-black/18 px-3 py-3"
        animate={{
          y: isActive && !reducedMotion ? -1.5 : 0,
          borderColor: isActive ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)",
          backgroundColor: isActive ? "rgba(4,8,15,0.26)" : "rgba(0,0,0,0.18)",
          boxShadow: isActive
            ? `0 18px 30px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 10px 24px ${glow}`
            : "0 0 0 1px rgba(255,255,255,0.02) inset",
        }}
        transition={{ duration: reducedMotion ? 0.2 : 0.38, ease: sectionMotion.transition.ease }}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            backgroundImage: `radial-gradient(circle at 84% 14%, ${highlight}, transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 56%)`,
          }}
          animate={
            isActive
              ? reducedMotion
                ? { opacity: 0.56, scale: 1 }
                : { opacity: [0, 0.78, 0.62], scale: [0.98, 1.03, 1] }
              : { opacity: 0, scale: 1 }
          }
          transition={{
            duration: reducedMotion ? 0.18 : 0.54,
            ease: sectionMotion.transition.ease,
            times: reducedMotion ? undefined : [0, 0.72, 1],
          }}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 h-16 w-10 rotate-[18deg] blur-[10px]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${sheen} 38%, transparent 100%)`,
          }}
          animate={
            isActive
              ? reducedMotion
                ? { opacity: 0.22, x: 0, y: 0 }
                : { opacity: [0, 0.36, 0.12], x: [14, -8, -2], y: [6, -4, 0] }
              : { opacity: 0, x: 14, y: 6 }
          }
          transition={{
            duration: reducedMotion ? 0.18 : 0.6,
            ease: sectionMotion.transition.ease,
            times: reducedMotion ? undefined : [0, 0.68, 1],
          }}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-2 h-8 w-8 rounded-full blur-xl"
          style={{ backgroundColor: accent }}
          animate={
            isActive
              ? reducedMotion
                ? { opacity: 0.16, scale: 1 }
                : { opacity: [0, 0.18, 0.12], scale: [0.72, 1.08, 1] }
              : { opacity: 0, scale: 0.72 }
          }
          transition={{
            duration: reducedMotion ? 0.18 : 0.52,
            ease: sectionMotion.transition.ease,
            times: reducedMotion ? undefined : [0, 0.66, 1],
          }}
        />

        <div className="relative z-10">
          <p className="text-lg font-semibold tracking-[-0.04em] text-white">{value}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/42">{label}</p>
        </div>
      </motion.div>
    </motion.button>
  );
}

function SkillTracksIllustration({ className }: { className?: string }) {
  const blueGradient = useId();
  const tealGradient = useId();
  const slateGradient = useId();
  const goldGradient = useId();

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 88 88"
      fill="none"
      style={{ filter: "drop-shadow(0 14px 20px rgba(7,12,24,0.28))" }}
    >
      <defs>
        <linearGradient id={blueGradient} x1="18" y1="18" x2="58" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d7ebff" />
          <stop offset="0.55" stopColor="#80b1ff" />
          <stop offset="1" stopColor="#436dca" />
        </linearGradient>
        <linearGradient id={tealGradient} x1="28" y1="26" x2="68" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ddfff8" />
          <stop offset="0.52" stopColor="#68dcc2" />
          <stop offset="1" stopColor="#2e9e93" />
        </linearGradient>
        <linearGradient id={slateGradient} x1="22" y1="40" x2="62" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f4b80" />
          <stop offset="0.55" stopColor="#1b2d4b" />
          <stop offset="1" stopColor="#101929" />
        </linearGradient>
        <linearGradient id={goldGradient} x1="28" y1="44" x2="55" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff4cc" />
          <stop offset="0.5" stopColor="#ffd36d" />
          <stop offset="1" stopColor="#f0a432" />
        </linearGradient>
      </defs>

      <ellipse cx="44" cy="72" rx="22" ry="6.5" fill="rgba(4,8,15,0.22)" />
      <g>
        <rect
          x="16"
          y="18"
          width="38"
          height="20"
          rx="8"
          transform="rotate(-11 16 18)"
          fill={`url(#${blueGradient})`}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
        />
        <rect
          x="30"
          y="28"
          width="40"
          height="20"
          rx="8"
          transform="rotate(10 30 28)"
          fill={`url(#${tealGradient})`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.2"
        />
        <rect
          x="22"
          y="38"
          width="42"
          height="24"
          rx="9"
          fill={`url(#${slateGradient})`}
          stroke="rgba(214,231,255,0.18)"
          strokeWidth="1.2"
        />
        <rect x="29" y="46" width="26" height="5.5" rx="2.75" fill={`url(#${goldGradient})`} />
        <circle cx="58" cy="23" r="5.5" fill="#f4c86a" />
        <circle cx="58" cy="23" r="2.3" fill="#fff7da" />
      </g>
    </svg>
  );
}

function ExperienceTimepieceIllustration({ className }: { className?: string }) {
  const bezelGradient = useId();
  const faceGradient = useId();
  const trimGradient = useId();

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 88 88"
      fill="none"
      style={{ filter: "drop-shadow(0 14px 20px rgba(8,12,24,0.26))" }}
    >
      <defs>
        <linearGradient id={bezelGradient} x1="21" y1="16" x2="65" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff1c8" />
          <stop offset="0.48" stopColor="#e2b860" />
          <stop offset="1" stopColor="#9a6b23" />
        </linearGradient>
        <linearGradient id={faceGradient} x1="28" y1="24" x2="60" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#233d61" />
          <stop offset="0.58" stopColor="#17273f" />
          <stop offset="1" stopColor="#101726" />
        </linearGradient>
        <linearGradient id={trimGradient} x1="38" y1="8" x2="52" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff4cf" />
          <stop offset="1" stopColor="#c89335" />
        </linearGradient>
      </defs>

      <ellipse cx="44" cy="72" rx="19" ry="5.5" fill="rgba(4,8,15,0.22)" />
      <g>
        <rect x="34" y="10" width="20" height="10" rx="5" fill={`url(#${trimGradient})`} />
        <rect x="38" y="5" width="12" height="8" rx="4" fill="#f7ddb0" />
        <circle
          cx="44"
          cy="45"
          r="25"
          fill={`url(#${bezelGradient})`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.2"
        />
        <circle
          cx="44"
          cy="45"
          r="18"
          fill={`url(#${faceGradient})`}
          stroke="rgba(223,233,255,0.16)"
          strokeWidth="1.2"
        />
        <path d="M44 31V45L56 49" stroke="#f8fbff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M44 45L38 55" stroke="#8fe5d8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="44" cy="45" r="4.4" fill="#f6d27c" />
        <circle cx="44" cy="45" r="1.8" fill="#fff8de" />
        <rect x="61" y="23" width="8" height="11" rx="4" fill="#efc26b" />
        <path d="M31 28C34 25 38 23 44 23" stroke="rgba(255,255,255,0.24)" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function SecondarySkillsBurstIllustration({ className }: { className?: string }) {
  const burstGradient = useId();
  const centerGradient = useId();
  const aquaGradient = useId();

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 88 88"
      fill="none"
      style={{ filter: "drop-shadow(0 14px 20px rgba(7,14,24,0.24))" }}
    >
      <defs>
        <linearGradient id={burstGradient} x1="18" y1="12" x2="66" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff2cd" />
          <stop offset="0.38" stopColor="#7de0cf" />
          <stop offset="0.72" stopColor="#7aa9ff" />
          <stop offset="1" stopColor="#3b4db8" />
        </linearGradient>
        <radialGradient id={centerGradient} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(44 44) rotate(90) scale(22)">
          <stop stopColor="#fffdf2" />
          <stop offset="0.52" stopColor="#d8fff7" />
          <stop offset="1" stopColor="#87d5e8" />
        </radialGradient>
        <linearGradient id={aquaGradient} x1="52" y1="18" x2="73" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ebfff8" />
          <stop offset="1" stopColor="#5ec8d6" />
        </linearGradient>
      </defs>

      <ellipse cx="44" cy="71" rx="20" ry="5.5" fill="rgba(4,8,15,0.2)" />
      <g>
        <path
          d="M44 12L51 31L70 38L51 45L44 64L37 45L18 38L37 31L44 12Z"
          fill={`url(#${burstGradient})`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <circle
          cx="44"
          cy="38"
          r="10"
          fill={`url(#${centerGradient})`}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        <path
          d="M63 16L66 25L75 28L66 31L63 40L60 31L51 28L60 25L63 16Z"
          fill={`url(#${aquaGradient})`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <circle cx="21" cy="57" r="5" fill="#ffbf7a" />
        <circle cx="21" cy="57" r="2.1" fill="#fff4d5" />
        <circle cx="65" cy="58" r="4.5" fill="#86dfff" />
        <circle cx="65" cy="58" r="1.9" fill="#f8fdff" />
      </g>
    </svg>
  );
}

function CrownAchievementIllustration({ className }: { className?: string }) {
  const crownGradient = useId();
  const bandGradient = useId();
  const jewelGradient = useId();

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 88 88"
      fill="none"
      style={{ filter: "drop-shadow(0 16px 22px rgba(8,12,24,0.28))" }}
    >
      <defs>
        <linearGradient id={crownGradient} x1="20" y1="24" x2="68" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff6d2" />
          <stop offset="0.46" stopColor="#ffc96a" />
          <stop offset="1" stopColor="#d38824" />
        </linearGradient>
        <linearGradient id={bandGradient} x1="24" y1="48" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe79f" />
          <stop offset="1" stopColor="#f09a2f" />
        </linearGradient>
        <linearGradient id={jewelGradient} x1="39" y1="43" x2="49" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d8e7ff" />
          <stop offset="0.5" stopColor="#75a5ff" />
          <stop offset="1" stopColor="#4f55d5" />
        </linearGradient>
      </defs>

      <ellipse cx="44" cy="72" rx="20" ry="5.5" fill="rgba(4,8,15,0.22)" />
      <g>
        <path
          d="M22 31L32 43L44 21L56 43L66 30L66 53H22V31Z"
          fill={`url(#${crownGradient})`}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <rect
          x="20"
          y="53"
          width="48"
          height="11"
          rx="5.5"
          fill={`url(#${bandGradient})`}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.1"
        />
        <circle cx="32" cy="35" r="3.6" fill="#fff2c9" />
        <circle cx="56" cy="35" r="3.6" fill="#fff2c9" />
        <circle cx="44" cy="27" r="3.9" fill="#fff7d7" />
        <rect x="38" y="44" width="12" height="10" rx="4" fill={`url(#${jewelGradient})`} />
        <path d="M31 58H57" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function LinkedInProfilePort() {
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <section className="mt-5 overflow-hidden rounded-[1.8rem] border border-[#dce6f1] bg-[#f4f2ee] shadow-[0_18px_44px_rgba(0,0,0,0.16)]">
      <div className="border-b border-[#e5e9ee] bg-white px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9e2ec] bg-[#f7f9fb] px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#526a84]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a66c2] text-[0.62rem] font-semibold text-white">
              in
            </span>
            LinkedIn
          </div>
          <Link
            href={linkedInProfilePort.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#d0d9e3] bg-white px-3 py-2 text-xs font-medium text-[#526a84] transition duration-[var(--motion-base)] hover:border-[#b8c7d8] hover:text-[#0a66c2]"
          >
            Open profile
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="overflow-hidden rounded-[1.1rem] border border-[#dfe3e8] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div className="relative h-[96px] overflow-hidden border-b border-[#eef2f6] bg-[linear-gradient(135deg,#182438_0%,#233755_22%,#2f6fbf_44%,#8b67ff_64%,#ff7a59_86%,#ffd166_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.26),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.2),transparent_24%),radial-gradient(circle_at_48%_100%,rgba(255,255,255,0.14),transparent_32%)]" />
            <div className="absolute inset-0 opacity-90">
              <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 600 120" preserveAspectRatio="none">
                <motion.path
                  d={linkedInBannerWaves.top[0]}
                  fill="rgba(255,255,255,0.16)"
                  animate={reducedMotion ? undefined : { d: [...linkedInBannerWaves.top] }}
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 4.8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                  }
                />
                <motion.path
                  d={linkedInBannerWaves.middle[0]}
                  fill="rgba(120,239,255,0.24)"
                  animate={reducedMotion ? undefined : { d: [...linkedInBannerWaves.middle] }}
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 6.4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 0.3,
                        }
                  }
                />
                <motion.path
                  d={linkedInBannerWaves.bottom[0]}
                  fill="rgba(255,132,202,0.2)"
                  animate={reducedMotion ? undefined : { d: [...linkedInBannerWaves.bottom] }}
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 5.6,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 0.15,
                        }
                  }
                />
              </svg>
            </div>
            <div className="absolute inset-0 shadow-[inset_0_-26px_42px_rgba(255,255,255,0.16),inset_0_0_50px_rgba(91,160,255,0.22)]" />
          </div>

          <div className="relative px-5 pb-4 pt-0">
            {profileContent.avatarPath ? (
              <div className="relative -mt-12 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-[#eef3f8] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <Image
                  src={profileContent.avatarPath}
                  alt={profileContent.avatarLabel}
                  fill
                  sizes="96px"
                  className="object-cover object-[center_18%]"
                  priority
                />
              </div>
            ) : null}

            <div className="mt-3 space-y-4">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
                <div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[1.9rem] font-semibold tracking-[-0.05em] text-[#191919]">
                        {linkedInProfilePort.name}
                      </h2>
                      <BadgeCheck className="h-5 w-5 text-[#0a66c2]" strokeWidth={1.9} />
                    </div>
                    <p className="mt-1 text-[1.02rem] text-[#191919]">
                      {linkedInProfilePort.headline}
                    </p>
                  </div>
                </div>

                <div className="grid gap-1.5 md:pt-1">
                  <div className="rounded-[0.9rem] border border-[#eef2f6] bg-[#fcfdff] px-3 py-2">
                    <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[0.7rem] bg-white">
                      <Image
                        src="/images/brand/lucem-health-mark.svg"
                        alt="Lucem Health logo"
                        width={28}
                        height={28}
                        className="h-auto w-7 object-contain"
                      />
                    </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.97rem] font-medium leading-5 text-[#191919]">{linkedInProfilePort.company}</p>
                      <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[#7b8794]">
                        Product Manager
                      </p>
                      </div>
                    </div>
                  </div>

                <div className="rounded-[0.9rem] border border-[#eef2f6] bg-[#fcfdff] px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[0.7rem] bg-white">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#f47d4f_0deg,#f4c24f_72deg,#66c3a5_144deg,#6f84ff_216deg,#dd6cc6_288deg,#f47d4f_360deg)] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
                        <div className="h-5 w-5 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.97rem] font-medium leading-5 text-[#191919]">
                        {linkedInProfilePort.mentorship}
                      </p>
                      <p className="text-[0.72rem] uppercase tracking-[0.14em] text-[#7b8794]">
                        Mentor
                      </p>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <p className="max-w-[520px] text-[1.02rem] italic leading-7 text-[#404040]">
                  {linkedInProfilePort.summary}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6f7781]">
                  <span>{linkedInProfilePort.location}</span>
                  <span>&middot;</span>
                  <Link
                    href={linkedInProfilePort.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#0a66c2] hover:underline"
                  >
                    Contact info
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium text-[#0a66c2]">
                  <Link
                    href={linkedInProfilePort.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {linkedInProfilePort.connections}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                <Link
                  href={linkedInProfilePort.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white"
                >
                  Message
                </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExpandablePrinciplesCard() {
  const reducedMotion = Boolean(useReducedMotion());
  const panelId = useId();
  const [isPrinciplesOpen, setIsPrinciplesOpen] = useState(false);
  const [hasOpenedPrinciples, setHasOpenedPrinciples] = useState(false);

  const handleToggle = () => {
    setIsPrinciplesOpen((current) => {
      const next = !current;

      if (next) {
        setHasOpenedPrinciples(true);
      }

      return next;
    });
  };

  const title = isPrinciplesOpen
    ? "Working principles"
    : hasOpenedPrinciples
      ? "4 principles"
      : "4 principles loaded";

  return (
    <div className="group relative mt-5">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-4 -bottom-2 top-6 blur-2xl transition duration-[var(--motion-base)] ${
          isPrinciplesOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 100%, rgba(147,184,255,0.12), transparent 34%), radial-gradient(circle at 84% 26%, rgba(155,140,255,0.14), transparent 44%)",
        }}
      />
      {!hasOpenedPrinciples ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-0 z-20 -translate-y-1/2"
        >
          <motion.span
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[#ff7d7d]/45 bg-[#ff4d4f] px-2 text-[1.04rem] font-bold leading-none text-white shadow-[0_0_16px_rgba(255,77,79,0.32),0_8px_20px_rgba(104,20,28,0.26)]"
            animate={
              reducedMotion
                ? undefined
                : {
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 0 16px rgba(255,77,79,0.32), 0 8px 20px rgba(104,20,28,0.26)",
                      "0 0 22px rgba(255,77,79,0.42), 0 10px 24px rgba(104,20,28,0.32)",
                      "0 0 16px rgba(255,77,79,0.32), 0 8px 20px rgba(104,20,28,0.26)",
                    ],
                  }
            }
            transition={{
              duration: 2.1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            4
          </motion.span>
        </span>
      ) : null}
      <motion.section
        layout={!reducedMotion}
        transition={
          reducedMotion
            ? undefined
            : {
                layout: {
                  duration: 0.42,
                  ease: sectionMotion.transition.ease,
                },
              }
        }
        className={`relative overflow-hidden rounded-[1.6rem] border bg-[linear-gradient(180deg,rgba(17,22,34,0.94),rgba(7,10,18,0.98))] p-4 shadow-[0_22px_52px_rgba(0,0,0,0.2)] transition duration-[var(--motion-base)] ${
          isPrinciplesOpen
            ? "border-white/14 shadow-[0_28px_64px_rgba(0,0,0,0.28)]"
            : "border-white/8 group-hover:-translate-y-1 group-hover:border-white/14 group-hover:shadow-[0_28px_64px_rgba(0,0,0,0.26)]"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 16%, rgba(155,140,255,0.1), transparent 28%), radial-gradient(circle at 18% 100%, rgba(147,184,255,0.08), transparent 30%)",
          }}
        />
        <Compass
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 top-1/2 h-36 w-36 -translate-y-1/2 text-white/[0.05]"
          strokeWidth={1.2}
        />

        <div className="relative">
          <button
            type="button"
            aria-expanded={isPrinciplesOpen}
            aria-controls={panelId}
            onClick={handleToggle}
            className="flex w-full cursor-pointer flex-col rounded-[1.2rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8eb7ff]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,12,19,0.96)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
                  WORKING PRINCIPLES
                </p>
                <p className="mt-3 text-[1.24rem] font-semibold tracking-[-0.04em] text-white">
                  {title}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--text-muted)]">
                  A few defaults that keep the work honest.
                </p>
              </div>

              <div className="flex shrink-0 self-center items-center gap-3">
                {isPrinciplesOpen && hasOpenedPrinciples ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-white/56">
                    Opened
                  </span>
                ) : null}

                <motion.span
                  aria-hidden="true"
                  className="text-white/54 transition duration-[var(--motion-base)] group-hover:text-white/82"
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          rotate: isPrinciplesOpen ? 180 : 0,
                        }
                  }
                  transition={{ duration: 0.28, ease: sectionMotion.transition.ease }}
                >
                  <ChevronDown className="h-6 w-6" strokeWidth={1.9} />
                </motion.span>
              </div>
            </div>
          </button>

          {reducedMotion ? (
            <div id={panelId} hidden={!isPrinciplesOpen} className="space-y-2.5 pt-4">
              {workingPrinciples.map((principle) => (
                <div
                  key={principle.index}
                  className="relative overflow-hidden rounded-[1.15rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,12,19,0.86))] px-4 py-4"
                  style={{ borderColor: principle.border }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 100% 0%, ${principle.glow}, transparent 42%)`,
                    }}
                  />
                  <div className="relative flex items-start gap-4">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.95rem] border text-[0.72rem] font-semibold tracking-[0.16em]"
                      style={{
                        color: principle.accent,
                        borderColor: `${principle.accent}2f`,
                        backgroundColor: principle.badge,
                      }}
                    >
                      {principle.index}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{principle.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                        {principle.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {isPrinciplesOpen ? (
                <motion.div
                  key="principles-panel"
                  id={panelId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: sectionMotion.transition.ease }}
                  className="pt-4"
                >
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={{
                      open: {
                        transition: {
                          staggerChildren: 0.06,
                          delayChildren: 0.04,
                        },
                      },
                      closed: {
                        transition: {
                          staggerChildren: 0.035,
                          staggerDirection: -1,
                        },
                      },
                    }}
                    className="space-y-2.5"
                  >
                    {workingPrinciples.map((principle) => (
                      <motion.div
                        key={principle.index}
                        variants={{
                          open: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              duration: 0.28,
                              ease: sectionMotion.transition.ease,
                            },
                          },
                          closed: {
                            opacity: 0,
                            y: 10,
                            scale: 0.985,
                            transition: {
                              duration: 0.18,
                              ease: [0.4, 0, 0.2, 1],
                            },
                          },
                        }}
                        className="relative overflow-hidden rounded-[1.15rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,12,19,0.86))] px-4 py-4"
                        style={{ borderColor: principle.border }}
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(circle at 100% 0%, ${principle.glow}, transparent 42%)`,
                          }}
                        />
                        <div className="relative flex items-start gap-4">
                          <span
                            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.95rem] border text-[0.72rem] font-semibold tracking-[0.16em]"
                            style={{
                              color: principle.accent,
                              borderColor: `${principle.accent}2f`,
                              backgroundColor: principle.badge,
                            }}
                          >
                            {principle.index}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {principle.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                              {principle.detail}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          )}
        </div>
      </motion.section>
    </div>
  );
}

function MetricSurface({
  label,
  value,
  detail,
  icon: Icon,
  accent,
  iconPosition,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: string;
  iconPosition: string;
}) {
  return (
    <div className="group relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 bottom-2 top-10 opacity-0 blur-2xl transition duration-[var(--motion-base)] group-hover:opacity-100"
        style={{
          backgroundImage: `radial-gradient(circle at 76% 50%, ${accent}, transparent 52%)`,
        }}
      />
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/16 p-4 transition duration-[var(--motion-base)] group-hover:-translate-y-1 group-hover:border-white/14 group-hover:shadow-[0_24px_54px_rgba(0,0,0,0.24)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 78% 50%, ${accent}, transparent 34%)`,
          }}
        />
        <Icon
          aria-hidden="true"
          className={`pointer-events-none absolute h-40 w-40 text-white/[0.05] ${iconPosition}`}
          strokeWidth={1.25}
        />
        <div className="relative">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/36">
            {label}
          </p>
          <p className="mt-3 text-[1.25rem] font-semibold tracking-[-0.04em] text-white">
            {value}
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function OperatingLane({
  lane,
  isExpanded = false,
  onToggle = () => {},
  onPreviewChange = () => {},
}: {
  lane: OperatingLane;
  isExpanded?: boolean;
  onToggle?: () => void;
  onPreviewChange?: (capabilityId: string | null) => void;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const [hovered, setHovered] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const isInteractive = hovered || focusVisible || pressed;
  const isElevated = isExpanded || isInteractive;
  const buttonId = `capability-stack-button-${lane.id}`;
  const panelId = `capability-stack-panel-${lane.id}`;
  const detailRows = [
    { label: "Best for", value: lane.bestFor },
    { label: "I watch for", value: lane.watchFor },
    { label: "I output", value: lane.output },
  ];

  return (
    <motion.section
      layout={!reducedMotion}
      className="relative overflow-hidden rounded-[1.85rem]"
      onHoverStart={() => {
        setHovered(true);
        onPreviewChange(lane.id);
      }}
      onHoverEnd={() => {
        setHovered(false);
        setPressed(false);
        onPreviewChange(null);
      }}
      transition={{
        layout: {
          duration: reducedMotion ? 0.18 : 0.34,
          ease: sectionMotion.transition.ease,
        },
      }}
    >
      <motion.div
        layout={!reducedMotion}
        className="relative overflow-hidden rounded-[1.85rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(8,12,19,0.92))] shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
        animate={{
          y: isExpanded ? (reducedMotion ? 0 : -2) : isInteractive && !reducedMotion ? -1 : 0,
          borderColor: isExpanded
            ? "rgba(255,255,255,0.18)"
            : isInteractive
              ? "rgba(255,255,255,0.15)"
              : "rgba(255,255,255,0.1)",
          boxShadow: isExpanded
            ? `0 30px 74px rgba(0,0,0,0.26), 0 0 0 1px ${lane.lineColor}1f inset`
            : isInteractive
              ? `0 24px 58px rgba(0,0,0,0.22), 0 0 0 1px ${lane.lineColor}14 inset`
              : "0 20px 50px rgba(0,0,0,0.18)",
        }}
        transition={{
          duration: reducedMotion ? 0.16 : 0.32,
          ease: sectionMotion.transition.ease,
        }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-3 -inset-y-2 blur-2xl"
          style={{
            backgroundImage: `radial-gradient(circle at 18% 50%, ${lane.glow}, transparent 58%)`,
          }}
          animate={{ opacity: isExpanded ? 1 : isInteractive ? 0.82 : 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.3, ease: sectionMotion.transition.ease }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 14% 50%, ${lane.glow}, transparent 48%)`,
          }}
          animate={{ opacity: isExpanded ? 0.9 : isInteractive ? 0.6 : 0.42 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.28, ease: sectionMotion.transition.ease }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 rounded-r-full"
          style={{
            width: lane.width,
            backgroundImage: `linear-gradient(90deg, ${lane.tint}, transparent)`,
          }}
          animate={{ opacity: isExpanded ? 0.96 : isInteractive ? 0.82 : 0.68 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.3, ease: sectionMotion.transition.ease }}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.05), transparent 34%, rgba(255,255,255,0.02))",
          }}
          animate={{ opacity: isExpanded ? 1 : isInteractive ? 0.78 : 0.56 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.28, ease: sectionMotion.transition.ease }}
        />

        <button
          id={buttonId}
          type="button"
          aria-controls={panelId}
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${lane.title} capability details`}
          className="relative block w-full cursor-pointer px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/16 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,12,19,0.96)]"
          onClick={onToggle}
          onFocus={(event) => {
            if (event.currentTarget.matches(":focus-visible")) {
              setFocusVisible(true);
              onPreviewChange(lane.id);
            }
          }}
          onBlur={() => {
            setFocusVisible(false);
            onPreviewChange(null);
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse") {
              setPressed(true);
            }
          }}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
        >
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex max-w-2xl items-start gap-4 sm:gap-5">
              <LaneCategoryIcon lane={lane} active={isElevated} reducedMotion={reducedMotion} />
              <div className="min-w-0">
                <h3 className="text-[1.22rem] font-semibold tracking-[-0.04em] text-white">
                  {lane.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
                  {lane.summary}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
              <motion.div
                className="rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em]"
                animate={{
                  borderColor: isExpanded
                    ? `${lane.lineColor}33`
                    : isInteractive
                      ? "rgba(255,255,255,0)"
                      : "rgba(255,255,255,0.1)",
                  backgroundColor: isExpanded
                    ? `${lane.lineColor}1f`
                    : isInteractive
                      ? `${lane.lineColor}18`
                      : "rgba(0,0,0,0.18)",
                  color: isExpanded
                    ? "#ffffff"
                    : isInteractive
                      ? "rgba(255,255,255,0.92)"
                      : "rgba(255,255,255,0.58)",
                  boxShadow: isExpanded
                    ? `0 0 22px ${lane.lineColor}24`
                    : isInteractive
                      ? `0 0 18px ${lane.lineColor}1c`
                      : "0 0 0 rgba(0,0,0,0)",
                }}
                transition={{
                  duration: reducedMotion ? 0.16 : 0.3,
                  ease: sectionMotion.transition.ease,
                }}
              >
                {lane.emphasis}
              </motion.div>
              <div className="relative flex h-8 w-8 items-center justify-center">
                <motion.span
                  aria-hidden="true"
                  className="text-white/54"
                  animate={{
                    rotate: isExpanded ? 180 : 0,
                    color: isElevated ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.54)",
                  }}
                  transition={{
                    duration: reducedMotion ? 0.14 : 0.28,
                    ease: sectionMotion.transition.ease,
                  }}
                >
                  <ChevronDown className="h-6 w-6" strokeWidth={1.9} />
                </motion.span>
              </div>
            </div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              key={`${lane.id}-details`}
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{
                duration: reducedMotion ? 0.16 : 0.32,
                ease: sectionMotion.transition.ease,
              }}
              className="overflow-hidden px-5 pb-5"
            >
              <motion.div
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                transition={{
                  duration: reducedMotion ? 0.14 : 0.24,
                  ease: sectionMotion.transition.ease,
                }}
                className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(8,12,19,0.52),rgba(4,8,15,0.74))] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              >
                <div className="grid gap-2.5">
                  {detailRows.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                      transition={{
                        duration: reducedMotion ? 0.12 : 0.22,
                        delay: reducedMotion ? 0 : 0.04 * index,
                        ease: sectionMotion.transition.ease,
                      }}
                      className="grid gap-2 rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-start sm:gap-4"
                    >
                      <div className="flex items-center gap-2.5 whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/42">
                        <motion.span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: lane.lineColor,
                            boxShadow: `0 0 12px ${lane.lineColor}66`,
                          }}
                          animate={
                            reducedMotion
                              ? { opacity: 0.9, scale: 1 }
                              : {
                                  opacity: [0.62, 1, 0.74],
                                  scale: [1, 1.16, 1],
                                  boxShadow: [
                                    `0 0 8px ${lane.lineColor}44`,
                                    `0 0 14px ${lane.lineColor}7a`,
                                    `0 0 10px ${lane.lineColor}52`,
                                  ],
                                }
                          }
                          transition={
                            reducedMotion
                              ? { duration: 0.16, ease: "easeOut" }
                              : {
                                  duration: 1.8,
                                  delay: index * 0.08,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                                }
                          }
                        />
                        {item.label}
                      </div>
                      <p className="text-sm leading-6 text-white/84">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}

function LaneCategoryIcon({
  lane,
  active,
  reducedMotion,
}: {
  lane: OperatingLane;
  active: boolean;
  reducedMotion: boolean;
}) {
  const Icon = lane.icon;

  return (
    <motion.div
      className="relative flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-[1rem] border border-white/10 bg-black/18"
      style={{ color: lane.lineColor }}
      aria-hidden="true"
      animate={{
        borderColor: active ? `${lane.lineColor}30` : "rgba(255,255,255,0.1)",
        backgroundColor: active ? "rgba(4,8,15,0.42)" : "rgba(0,0,0,0.18)",
        boxShadow: active
          ? `0 0 0 1px ${lane.lineColor}12 inset, 0 10px 24px ${lane.lineColor}14`
          : `0 0 0 1px ${lane.lineColor}08 inset`,
      }}
      transition={{
        duration: reducedMotion ? 0.14 : 0.28,
        ease: sectionMotion.transition.ease,
      }}
    >
      <motion.span
        className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[16px]"
        style={{ backgroundColor: `${lane.lineColor}34` }}
        animate={{
          opacity: active ? 0.95 : 0.5,
          scale: active && !reducedMotion ? [0.92, 1.08, 0.96] : 1,
        }}
        transition={
          active && !reducedMotion
            ? {
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
            : { duration: 0.14, ease: "easeOut" }
        }
      />
      <motion.span
        className="pointer-events-none absolute inset-[5px] rounded-[0.85rem] border"
        style={{ borderColor: `${lane.lineColor}2a` }}
        animate={{
          opacity: active ? 0.9 : 0.36,
          scale: active && !reducedMotion ? [1, 0.96, 1] : 1,
        }}
        transition={
          active && !reducedMotion
            ? {
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
            : { duration: 0.16, ease: "easeOut" }
        }
      />
      <motion.span
        className="relative z-10"
        animate={{
          scale: active ? 1.03 : 1,
          rotate:
            active && !reducedMotion && lane.id === "commercial-thinking"
              ? [-3, 0, -1]
              : 0,
          y:
            active && !reducedMotion && lane.id === "healthcare-ai"
              ? [0.5, -0.5, 0]
              : 0,
        }}
        transition={
          active && !reducedMotion
            ? {
                duration: 1.4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }
            : { duration: 0.16, ease: "easeOut" }
        }
      >
        <Icon className="h-6 w-6" strokeWidth={2.05} />
      </motion.span>

      {lane.id === "product-strategy" ? (
        <motion.span
          className="pointer-events-none absolute inset-[11px] rounded-full border"
          style={{ borderColor: `${lane.lineColor}38` }}
          animate={{
            opacity: active ? 0.8 : 0.34,
            scale: active && !reducedMotion ? [1.04, 0.9, 0.98] : 1,
          }}
          transition={
            active && !reducedMotion
              ? {
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : { duration: 0.16, ease: "easeOut" }
          }
        />
      ) : null}

      {lane.id === "ux-systems-design" ? (
        <motion.span
          className="pointer-events-none absolute inset-[8px] grid grid-cols-2 gap-1"
          animate={{ opacity: active ? 1 : 0.52 }}
          transition={{ duration: reducedMotion ? 0.14 : 0.24, ease: sectionMotion.transition.ease }}
        >
          {[0, 1, 2, 3].map((cell) => (
            <motion.span
              key={cell}
              className="rounded-[4px] border"
              style={{
                borderColor: `${lane.lineColor}26`,
                backgroundColor: `${lane.lineColor}14`,
              }}
              animate={{
                opacity: active && !reducedMotion ? [0.28, 0.75, 0.4] : active ? 0.48 : 0.24,
                scale: active && !reducedMotion ? [0.94, 1, 0.96] : 1,
              }}
              transition={{
                duration: 1.2,
                delay: cell * 0.08,
                repeat: active && !reducedMotion ? Number.POSITIVE_INFINITY : 0,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.span>
      ) : null}

      {lane.id === "healthcare-ai" ? (
        <motion.span
          className="pointer-events-none absolute bottom-[8px] left-1/2 h-[2px] w-[18px] -translate-x-1/2 rounded-full"
          style={{ backgroundColor: `${lane.lineColor}aa` }}
          animate={{
            opacity: active ? 0.82 : 0.32,
            scaleX: active && !reducedMotion ? [0.72, 1, 0.88] : 1,
          }}
          transition={
            active && !reducedMotion
              ? {
                  duration: 1.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : { duration: 0.16, ease: "easeOut" }
          }
        />
      ) : null}

      {lane.id === "workflow-design" ? (
        <>
          <motion.span
            className="pointer-events-none absolute left-[8px] top-1/2 h-[2px] rounded-full"
            style={{ backgroundColor: `${lane.lineColor}9e` }}
            animate={{
              width: active ? 26 : 16,
              opacity: active ? 0.76 : 0.32,
            }}
            transition={{ duration: reducedMotion ? 0.14 : 0.26, ease: sectionMotion.transition.ease }}
          />
          {[8, 34].map((left, index) => (
            <motion.span
              key={left}
              className="pointer-events-none absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
              style={{ left, backgroundColor: lane.lineColor }}
              animate={{
                opacity: active ? 0.95 : 0.46,
                scale: active && !reducedMotion ? [1, 1.18, 1] : 1,
              }}
              transition={{
                duration: 1.1,
                delay: index * 0.1,
                repeat: active && !reducedMotion ? Number.POSITIVE_INFINITY : 0,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      ) : null}

      {lane.id === "commercial-thinking" ? (
        <motion.span
          className="pointer-events-none absolute bottom-[8px] left-1/2 h-[2px] w-[20px] -translate-x-1/2 rounded-full"
          style={{ backgroundColor: `${lane.lineColor}92` }}
          animate={{
            rotate: active && !reducedMotion ? [-5, 0, -1.5] : 0,
            opacity: active ? 0.72 : 0.32,
          }}
          transition={
            active && !reducedMotion
              ? {
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : { duration: 0.16, ease: "easeOut" }
          }
        />
      ) : null}
    </motion.div>
  );
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  const smoothing = 0.16;
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const previous = points[index - 1] ?? current;
    const following = points[index + 2] ?? next;

    const cp1x = current.x + (next.x - previous.x) * smoothing;
    const cp1y = current.y + (next.y - previous.y) * smoothing;
    const cp2x = next.x - (following.x - current.x) * smoothing;
    const cp2y = next.y - (following.y - current.y) * smoothing;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  return path;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

