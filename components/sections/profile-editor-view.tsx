"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  PencilLine,
  RefreshCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SquareStack,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";

import { profileContent } from "@/data/site-content";
import { cn } from "@/lib/utils";

import {
  BrumbleSwitch,
  BrokenBrumbleSwitch,
} from "@/components/ui/brumble-switch";
import { AvatarPlaceholder } from "@/components/ui/placeholders";
import { RecoveryTerminalOverlay } from "@/components/ui/recovery-terminal-overlay";
import { StatusPill } from "@/components/ui/status-pill";
import { useToast } from "@/components/ui/toast";

const sectionMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const },
};

const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const LANGUAGE_FILTER_STORAGE_KEY = "brumbleyos-profile-language-filter-knob";
const LANGUAGE_FILTER_BREAK_THRESHOLD = 6;

type SmallTalkMode = "low" | "moderate" | "expanded";
type LanguageFilterMode = "active" | "broken" | "repaired" | "tapeRemoved";
type PersistedLanguageFilterState = {
  state: "active" | "broken" | "repaired";
  hasExperiencedRecovery?: boolean;
};

const languageFilterDamageCopy = [
  {
    status: "On",
    helper: "Operational, with minor cosmetic concerns.",
  },
  {
    status: "On",
    helper: "Enabled. Stability not guaranteed.",
  },
  {
    status: "On",
    helper: "On. Filtering remains mostly operational.",
  },
  {
    status: "Strained",
    helper: "Filtering active. Mechanical confidence declining.",
  },
  {
    status: "Strained",
    helper: "Tone regulation online. Structural integrity questionable.",
  },
  {
    status: "Strained",
    helper: "Filtering remains mostly operational. Touching it feels optimistic.",
  },
] as const;

const languageFilterBrokenCopy = {
  status: "Offline",
  helper: "Language filter unavailable. Knob failure detected.",
};

const languageFilterRepairedCopy = {
  status: "Patched",
  helper: "Repaired by IT. Further adjustment discouraged.",
};

const languageFilterTapeRemovedCopy = {
  status: "Unsecured",
  helper: "IT said don't touch that again. I would stop. Seriously.",
};

const languageFilterRepairWarning =
  "IT has already intervened. Further adjustment is not recommended.";

const languageFilterRecoveryLiveMessage =
  "Recovery console engaged. IT is handling the consequences.";

const jargonSuppressionCopy = {
  on: "Active. Buzzword inflation held in check.",
  off: "Disabled. Strategy theater may re-enter the room.",
};

const smallTalkOptions: {
  id: SmallTalkMode;
  label: string;
  helper: string;
}[] = [
  {
    id: "low",
    label: "Low",
    helper: "Minimal. Friendly, but not recreational.",
  },
  {
    id: "moderate",
    label: "Moderate",
    helper: "Enough to be civil before the useful part starts.",
  },
  {
    id: "expanded",
    label: "Expanded",
    helper: "Available for stakeholder recovery scenarios.",
  },
];

const smallTalkToneClasses: Record<
  SmallTalkMode,
  {
    active: string;
    focus: string;
    hover: string;
  }
> = {
  low: {
    active:
      "bg-[rgba(115,224,169,0.14)] text-[color:var(--accent-strong)] shadow-[0_10px_24px_rgba(18,39,31,0.18)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(115,224,169,0.26)]",
    hover: "hover:text-[color:var(--accent-strong)]",
  },
  moderate: {
    active:
      "bg-[rgba(156,174,212,0.18)] text-[#e1e9fb] shadow-[0_10px_24px_rgba(28,36,54,0.2)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(156,174,212,0.28)]",
    hover: "hover:text-[#d4def6]",
  },
  expanded: {
    active:
      "bg-[rgba(255,174,112,0.16)] text-[#ffd8bf] shadow-[0_10px_24px_rgba(66,40,19,0.2)]",
    focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,174,112,0.26)]",
    hover: "hover:text-[#ffd8bf]",
  },
};

function pickMessage(messages: string[]) {
  return messages[Math.floor(Math.random() * messages.length)] ?? "";
}

function restoreChipOrder(chips: string[]) {
  return profileContent.specialtyChips.filter((chip) => chips.includes(chip));
}

function setPersistedLanguageFilterState(nextState: PersistedLanguageFilterState) {
  window.localStorage.setItem(
    LANGUAGE_FILTER_STORAGE_KEY,
    JSON.stringify(nextState),
  );
}

function getPersistedLanguageFilterState(): PersistedLanguageFilterState {
  try {
    const storedValue = window.localStorage.getItem(LANGUAGE_FILTER_STORAGE_KEY);

    if (!storedValue) {
      return { state: "active", hasExperiencedRecovery: false };
    }

    const parsed = JSON.parse(storedValue) as
      | { state?: LanguageFilterMode; hasExperiencedRecovery?: boolean }
      | null;
    const hasExperiencedRecovery = Boolean(parsed?.hasExperiencedRecovery);

    if (!parsed?.state) {
      return { state: "active", hasExperiencedRecovery };
    }

    if (parsed.state === "broken") {
      const repairedState = {
        state: "repaired",
        hasExperiencedRecovery,
      } satisfies PersistedLanguageFilterState;
      setPersistedLanguageFilterState(repairedState);
      return repairedState;
    }

    return {
      state:
        parsed.state === "repaired" || parsed.state === "tapeRemoved"
          ? "repaired"
          : "active",
      hasExperiencedRecovery,
    };
  } catch {
    window.localStorage.removeItem(LANGUAGE_FILTER_STORAGE_KEY);
    return { state: "active", hasExperiencedRecovery: false };
  }
}

export function ProfileEditorView() {
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const { pushToast } = useToast();
  const aboutFieldId = useId();
  const roleFieldId = useId();
  const fluffFieldId = useId();
  const languageFilterHintId = useId();
  const jargonHintId = useId();
  const smallTalkHintId = useId();
  const aboutFieldRef = useRef<HTMLTextAreaElement>(null);
  const timeoutIdsRef = useRef<number[]>([]);
  const fluffResetPendingRef = useRef(false);

  const initialAboutValue = profileContent.aboutField.body.join("\n\n");
  const [isEditMode, setIsEditMode] = useState(false);
  const [aboutDraft, setAboutDraft] = useState(initialAboutValue);
  const [roleDraft, setRoleDraft] = useState(profileContent.role);
  const [specialtyDraft, setSpecialtyDraft] = useState(profileContent.specialtyChips);
  const [restoringChip, setRestoringChip] = useState<string | null>(null);
  const [fluffTolerance, setFluffTolerance] = useState(0);
  const [languageFilterMode, setLanguageFilterMode] =
    useState<LanguageFilterMode>("active");
  const [languageFilterDamage, setLanguageFilterDamage] = useState(0);
  const [languageFilterRepairNudges, setLanguageFilterRepairNudges] = useState(0);
  const [hasExperiencedLanguageFilterRecovery, setHasExperiencedLanguageFilterRecovery] =
    useState(false);
  const [recoveryTriggered, setRecoveryTriggered] = useState(false);
  const [jargonSuppressionEnabled, setJargonSuppressionEnabled] = useState(true);
  const [smallTalkMode, setSmallTalkMode] = useState<SmallTalkMode>("low");
  const [rewriteIndex, setRewriteIndex] = useState(-1);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const hasAboutDraft = aboutDraft !== initialAboutValue;
  const isDirty = hasAboutDraft;
  const rewriteMode =
    rewriteIndex >= 0 ? profileContent.playful.bioRewriteModes[rewriteIndex] : null;
  const smallTalkSelection =
    smallTalkOptions.find((option) => option.id === smallTalkMode) ?? smallTalkOptions[0];
  const languageFilterMeta =
    languageFilterMode === "broken"
      ? languageFilterBrokenCopy
      : languageFilterMode === "tapeRemoved"
        ? languageFilterTapeRemovedCopy
      : languageFilterMode === "repaired"
        ? {
            ...languageFilterRepairedCopy,
            helper:
              languageFilterRepairNudges > 0
                ? languageFilterRepairWarning
                : languageFilterRepairedCopy.helper,
          }
        : languageFilterDamageCopy[
            Math.min(languageFilterDamage, languageFilterDamageCopy.length - 1)
          ];
  const communicationFooterMessage = languageFilterMode === "broken"
    ? "Manual tone regulation is temporarily offline."
    : languageFilterMode === "tapeRemoved"
      ? "Repair integrity compromised. Local support has stopped saying please."
    : languageFilterMode === "repaired"
      ? languageFilterRepairNudges > 0
        ? "Touch request denied by local support."
        : "Repair integrity prioritized over user freedom."
      : !jargonSuppressionEnabled
      ? "Corporate language leak no longer fully contained."
      : smallTalkMode === "expanded"
        ? "Tone softened where commercially necessary."
        : "Corporate language leak contained.";

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    const persistedState = getPersistedLanguageFilterState();

    if (
      persistedState.state === "active" &&
      !persistedState.hasExperiencedRecovery
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLanguageFilterMode(persistedState.state);
      setLanguageFilterDamage(0);
      setLanguageFilterRepairNudges(0);
      setHasExperiencedLanguageFilterRecovery(
        Boolean(persistedState.hasExperiencedRecovery),
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function persistLanguageFilterState(
    state: PersistedLanguageFilterState["state"],
    hasExperiencedRecovery = hasExperiencedLanguageFilterRecovery,
  ) {
    setPersistedLanguageFilterState({
      state,
      hasExperiencedRecovery,
    });
  }

  function queueTimeout(callback: () => void, delay: number) {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutIdsRef.current.push(timeoutId);
    return timeoutId;
  }

  function clearPendingTimeouts() {
    timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutIdsRef.current = [];
    fluffResetPendingRef.current = false;
  }

  function handleEditToggle() {
    const nextEditMode = !isEditMode;
    setIsEditMode(nextEditMode);
    if (nextEditMode) {
      queueTimeout(() => aboutFieldRef.current?.focus(), 0);
    }
  }

  function handleResetDraft() {
    clearPendingTimeouts();
    setAboutDraft(initialAboutValue);
    setRoleDraft(profileContent.role);
    setSpecialtyDraft(profileContent.specialtyChips);
    setRestoringChip(null);
    setFluffTolerance(0);
    setIsReviewOpen(false);
    setLiveMessage("Local draft reset.");
  }

  function handleRoleCommit() {
    const nextRole = roleDraft.trim();
    if (!nextRole || nextRole === profileContent.role) {
      setRoleDraft(profileContent.role);
      return;
    }

    const message = pickMessage(profileContent.playful.roleGuardMessages);
    setRoleDraft(profileContent.role);
    setLiveMessage(message);
    pushToast({ title: "Role update blocked", body: message });
  }

  function handleRoleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setRoleDraft(profileContent.role);
      event.currentTarget.blur();
    }
  }

  function handleSpecialtyRemove(chip: string) {
    if (!isEditMode) {
      return;
    }

    const message = pickMessage(profileContent.playful.chipRestoreMessages);
    setSpecialtyDraft((current) => current.filter((item) => item !== chip));
    setLiveMessage(message);
    pushToast({ title: "Profile field protected", body: message });

    const restoreChip = () => {
      setSpecialtyDraft((current) => restoreChipOrder([...current, chip]));
      setRestoringChip(chip);
      queueTimeout(() => setRestoringChip((current) => (current === chip ? null : current)), reducedMotion ? 0 : 920);
    };

    if (reducedMotion) {
      restoreChip();
      return;
    }

    queueTimeout(restoreChip, 220);
  }

  function handleFluffToleranceChange(nextValue: number) {
    setFluffTolerance(nextValue);
    if (nextValue === 0 || fluffResetPendingRef.current) {
      return;
    }

    fluffResetPendingRef.current = true;
    const message = profileContent.playful.fluffTolerance.failureMessage;
    setLiveMessage(message);
    pushToast({ title: "Fluff tolerance locked", body: message });
    queueTimeout(() => {
      setFluffTolerance(0);
      fluffResetPendingRef.current = false;
    }, reducedMotion ? 0 : 220);
  }

  function handleCycleRewrite() {
    const nextIndex =
      rewriteIndex + 1 >= profileContent.playful.bioRewriteModes.length ? 0 : rewriteIndex + 1;
    setRewriteIndex(nextIndex);
    setLiveMessage(profileContent.playful.bioRewriteModes[nextIndex]?.verdict ?? "");
  }

  function handleLanguageFilterInteract() {
    if (recoveryTriggered || languageFilterMode === "broken") {
      return;
    }

    if (languageFilterMode === "tapeRemoved") {
      setRecoveryTriggered(true);
      setLiveMessage(languageFilterRecoveryLiveMessage);
      return;
    }

    if (languageFilterMode === "repaired") {
      setLanguageFilterRepairNudges((current) => current + 1);
      setLiveMessage(languageFilterRepairWarning);
      return;
    }

    const nextDamage = languageFilterDamage + 1;

    if (nextDamage >= LANGUAGE_FILTER_BREAK_THRESHOLD) {
      setLanguageFilterDamage(nextDamage);
      setLanguageFilterMode("broken");
      setLiveMessage(languageFilterBrokenCopy.helper);
      persistLanguageFilterState("broken");
      return;
    }

    setLanguageFilterDamage(nextDamage);
    setLiveMessage(
      languageFilterDamageCopy[
        Math.min(nextDamage, languageFilterDamageCopy.length - 1)
      ]?.helper ?? "",
    );
  }

  function handleLanguageFilterTapeRemove() {
    if (languageFilterMode !== "repaired") {
      return;
    }

    setLanguageFilterMode("tapeRemoved");
    setLanguageFilterRepairNudges(0);
    setLiveMessage(languageFilterTapeRemovedCopy.helper);
  }

  function handleLanguageFilterRecoveryComplete() {
    setHasExperiencedLanguageFilterRecovery(true);
    persistLanguageFilterState("repaired", true);
    setLanguageFilterMode("repaired");
    setLanguageFilterRepairNudges(0);
    setLiveMessage("Homepage restore initiated.");
    router.replace("/");
  }

  function handleLanguageFilterSecretReset() {
    setLanguageFilterMode("active");
    setLanguageFilterDamage(0);
    setLanguageFilterRepairNudges(0);
    setHasExperiencedLanguageFilterRecovery(false);
    setRecoveryTriggered(false);
    window.localStorage.removeItem(LANGUAGE_FILTER_STORAGE_KEY);
    setLiveMessage("Language filter restored to factory overconfidence.");
  }

  function handleJargonSuppressionChange(next: boolean) {
    setJargonSuppressionEnabled(next);
    setLiveMessage(next ? jargonSuppressionCopy.on : jargonSuppressionCopy.off);
  }

  function handleSmallTalkModeChange(nextMode: SmallTalkMode) {
    setSmallTalkMode(nextMode);
    const nextOption =
      smallTalkOptions.find((option) => option.id === nextMode) ?? smallTalkOptions[0];
    setLiveMessage(nextOption.helper);
  }

  return (
    <>
      <section className="space-y-6 pb-10">
        <motion.section
          {...sectionMotion}
          className={cn(
            "luxe-panel relative overflow-hidden rounded-[2.5rem] px-5 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8",
            isEditMode ? "border-[rgba(156,174,212,0.2)] shadow-[0_40px_120px_rgba(3,8,19,0.5)]" : "",
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 transition duration-[var(--motion-slow)]",
              isEditMode
                ? "bg-[radial-gradient(circle_at_10%_0%,rgba(142,166,218,0.22),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(67,88,136,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_32%)]"
                : "bg-[radial-gradient(circle_at_10%_0%,rgba(142,166,218,0.14),transparent_26%),radial-gradient(circle_at_88%_18%,rgba(67,88,136,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]",
            )}
          />

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap items-center gap-2.5">
                {profileContent.heroBadges.map((badge) => (
                  <StatusPill key={badge.label} tone={badge.tone}>
                    {badge.label}
                  </StatusPill>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <EditorButton
                  tone="secondary"
                  onClick={handleEditToggle}
                  aria-expanded={isEditMode}
                  aria-pressed={isEditMode}
                  className={cn(
                    "border-[color:var(--cool-accent-border)] text-white shadow-[0_16px_36px_rgba(5,9,18,0.18)]",
                    isEditMode
                      ? "bg-[linear-gradient(180deg,rgba(170,188,226,0.22),rgba(44,53,75,0.38))] hover:border-white/18 hover:bg-[linear-gradient(180deg,rgba(182,200,236,0.26),rgba(54,64,88,0.42))]"
                      : "bg-[linear-gradient(180deg,rgba(156,174,212,0.16),rgba(29,37,55,0.28))] hover:-translate-y-0.5 hover:border-white/16 hover:bg-[linear-gradient(180deg,rgba(170,188,226,0.22),rgba(39,48,70,0.36))]",
                  )}
                >
                  <PencilLine className="h-4 w-4" />
                  {isEditMode ? "Preview profile" : "Edit profile"}
                </EditorButton>
                {isDirty ? (
                  <EditorButton tone="secondary" onClick={handleResetDraft}>
                    <RefreshCcw className="h-4 w-4" />
                    Reset draft
                  </EditorButton>
                ) : null}
                {isEditMode && isDirty ? (
                  <EditorButton tone="primary" onClick={() => setIsReviewOpen(true)}>
                    <Save className="h-4 w-4" />
                    Save profile changes
                  </EditorButton>
                ) : null}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="space-y-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  {profileContent.avatarPath ? (
                    <div className="relative h-24 w-24 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[var(--shadow-panel)]">
                      <Image
                        src={profileContent.avatarPath}
                        alt={profileContent.avatarLabel}
                        fill
                        sizes="96px"
                        className="object-cover object-[center_18%]"
                        priority
                      />
                    </div>
                  ) : (
                    <AvatarPlaceholder label={profileContent.avatarLabel} />
                  )}

                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="space-y-3">
                      <p className="eyebrow">Profile</p>
                      <h2 className="text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
                        {profileContent.name}
                      </h2>
                      <p className="max-w-4xl text-xl leading-8 text-white/88 sm:text-[1.4rem]">
                        {profileContent.positioning}
                      </p>
                    </div>

                    <div className="space-y-3 text-base leading-7 text-[color:var(--text-muted)]">
                      {profileContent.heroSupport.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <ProfileFieldSurface
                    icon={UserRound}
                    label="Name"
                    helper="Anchored. Stable. Extremely unlikely to drift."
                  >
                    <div className="rounded-[1.25rem] border border-white/8 bg-black/14 px-4 py-3 text-base font-medium text-white">
                      {profileContent.name}
                    </div>
                  </ProfileFieldSurface>

                  <ProfileFieldSurface
                    icon={BriefcaseBusiness}
                    label="Role"
                    helper={
                      isEditMode
                        ? "Try editing it if you want. The title is resistant."
                        : "The title can be nudged. It usually snaps back."
                    }
                    active={isEditMode}
                  >
                    <label htmlFor={roleFieldId} className="sr-only">
                      Role
                    </label>
                    <input
                      id={roleFieldId}
                      value={roleDraft}
                      readOnly={!isEditMode}
                      onChange={(event) => setRoleDraft(event.target.value)}
                      onBlur={handleRoleCommit}
                      onKeyDown={handleRoleKeyDown}
                      className={cn(
                        "w-full rounded-[1.25rem] border px-4 py-3 text-base font-medium text-white focus:outline-none",
                        isEditMode
                          ? "border-white/14 bg-[rgba(255,255,255,0.05)]"
                          : "border-white/8 bg-black/14 text-white/88",
                      )}
                    />
                  </ProfileFieldSurface>

                  <ProfileFieldSurface
                    icon={SquareStack}
                    label="Specialty stack"
                    helper={
                      isEditMode
                        ? "Some specialties are load-bearing."
                        : "The short version of what kind of product work tends to fit."
                    }
                    active={isEditMode}
                    className="lg:col-span-2"
                  >
                    <div className="flex flex-wrap gap-2.5">
                      <AnimatePresence initial={false}>
                        {specialtyDraft.map((chip) => (
                          <motion.button
                            key={chip}
                            layout={!reducedMotion}
                            type="button"
                            onClick={() => handleSpecialtyRemove(chip)}
                            disabled={!isEditMode}
                            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
                            animate={
                              restoringChip === chip && !reducedMotion
                                ? {
                                    opacity: 1,
                                    scale: [0.98, 1.04, 1],
                                    boxShadow: [
                                      "0 0 0 rgba(126,224,207,0)",
                                      "0 0 24px rgba(126,224,207,0.18)",
                                      "0 0 0 rgba(126,224,207,0)",
                                    ],
                                  }
                                : { opacity: 1, scale: 1 }
                            }
                            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: reducedMotion ? 0.12 : 0.22, ease: sectionMotion.transition.ease }}
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition duration-[var(--motion-base)]",
                              isEditMode
                                ? "border-white/12 bg-white/[0.05] text-white hover:border-white/18 hover:bg-white/[0.08]"
                                : "cursor-default border-white/10 bg-black/14 text-white/84",
                            )}
                          >
                            <span>{chip}</span>
                            {isEditMode ? <span aria-hidden="true" className="text-xs text-white/46">x</span> : null}
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ProfileFieldSurface>
                </div>

                <ProfileFieldSurface
                  icon={PencilLine}
                  label={profileContent.aboutField.title}
                  helper="Local-only draft. Nothing gets sent. Refresh clears it."
                  active={isEditMode || isDirty}
                  headerAction={
                    isDirty ? (
                      <button
                        type="button"
                        onClick={() => setIsReviewOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-white/84 hover:border-white/18 hover:text-white"
                      >
                        Review suggestion
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    ) : null
                  }
                >
                  <label htmlFor={aboutFieldId} className="sr-only">
                    {profileContent.aboutField.title}
                  </label>
                  <textarea
                    ref={aboutFieldRef}
                    id={aboutFieldId}
                    value={aboutDraft}
                    readOnly={!isEditMode}
                    onChange={(event) => setAboutDraft(event.target.value)}
                    rows={9}
                    className={cn(
                      "min-h-[15rem] w-full rounded-[1.4rem] border px-4 py-4 text-sm leading-7 focus:outline-none sm:text-base",
                      isEditMode
                        ? "border-white/14 bg-[rgba(255,255,255,0.05)] text-white"
                        : "border-white/8 bg-black/14 text-white/86",
                    )}
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <StatusPill tone={isDirty ? "accent" : "neutral"}>
                      {isDirty ? "Changed locally" : "Live bio"}
                    </StatusPill>
                    <EditorButton tone="ghost" onClick={handleCycleRewrite}>
                      <Sparkles className="h-4 w-4" />
                      Try a rewrite
                    </EditorButton>
                  </div>

                  <AnimatePresence initial={false}>
                    {rewriteMode ? (
                      <motion.div
                        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: reducedMotion ? 0.12 : 0.2, ease: sectionMotion.transition.ease }}
                        className="mt-4 rounded-[1.35rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(10,14,20,0.9))] p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill tone="accent">{rewriteMode.label}</StatusPill>
                          <span className="text-xs uppercase tracking-[0.16em] text-white/42">Rewrite toy</span>
                        </div>
                        <p className="mt-4 text-base leading-7 text-white/88">{rewriteMode.output}</p>
                        <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">{rewriteMode.verdict}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </ProfileFieldSurface>
              </div>

              <div className="space-y-5">
                <motion.section {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.03 }} className="app-panel-muted rounded-[2rem] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="mt-0.5 h-5 w-5 text-[color:var(--accent)]" />
                    <div>
                      <p className="eyebrow">Profile Status</p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Profile Progress</h3>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-black/12 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{profileContent.completeness.title}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/72">
                        {profileContent.completeness.value}%
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={reducedMotion ? { width: `${profileContent.completeness.value}%` } : { width: 0 }}
                        animate={{ width: `${profileContent.completeness.value}%` }}
                        transition={{ duration: reducedMotion ? 0.12 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                        className="profile-progress-bar h-full rounded-full bg-[linear-gradient(90deg,rgba(126,224,207,0.92),rgba(147,184,255,0.9))]"
                      >
                        <span aria-hidden="true" className="profile-progress-bar__sheen" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {profileContent.completeness.checks.map((check) => (
                      <div key={check} className="flex items-start gap-3 rounded-[1.2rem] border border-white/8 bg-black/10 px-4 py-3 text-sm leading-6 text-white/82">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>

                </motion.section>

                <motion.section {...sectionMotion} transition={{ ...sectionMotion.transition, delay: 0.05 }} className="app-panel rounded-[2rem] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <SlidersHorizontal className="mt-0.5 h-5 w-5 text-[color:var(--accent)]" />
                    <div>
                      <p className="eyebrow">Communication preferences</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">
                        How Kyle tends to communicate
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
                        Calibrated for clarity, low fluff, and minimal patience for corporate theater.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(7,10,16,0.92))]">
                    <PreferenceRow
                      label={profileContent.playful.fluffTolerance.label}
                      status={fluffTolerance === 0 ? "Locked low" : "Correcting"}
                    >
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white">
                            {profileContent.playful.fluffTolerance.valueLabel}
                          </p>
                          <span className="text-xs uppercase tracking-[0.16em] text-white/42">
                            Runtime protected
                          </span>
                        </div>

                        <label htmlFor={fluffFieldId} className="sr-only">
                          {profileContent.playful.fluffTolerance.label}
                        </label>
                        <input
                          id={fluffFieldId}
                          type="range"
                          min={0}
                          max={100}
                          step={10}
                          value={fluffTolerance}
                          onChange={(event) => handleFluffToleranceChange(Number(event.target.value))}
                          className="h-2 w-full cursor-pointer accent-[color:var(--accent)]"
                        />

                        <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.16em] text-white/38">
                          <span>Critically low</span>
                          <span>Unwise amount</span>
                        </div>
                      </div>
                    </PreferenceRow>

                    <PreferenceRow
                      label="Language filter"
                      status={languageFilterMeta.status}
                      helper={languageFilterMeta.helper}
                      helperId={languageFilterHintId}
                      onStatusDoubleClick={
                        languageFilterMode === "repaired"
                          ? handleLanguageFilterSecretReset
                          : undefined
                      }
                      className="border-t border-white/8"
                    >
                      <div className="mt-4 flex justify-end">
                        <BrokenBrumbleSwitch
                          mode={languageFilterMode}
                          damage={languageFilterDamage}
                          repairNudges={languageFilterRepairNudges}
                          noteVariant={
                            hasExperiencedLanguageFilterRecovery
                              ? "escalated"
                              : "default"
                          }
                          label="Language filter"
                          ariaDescribedBy={languageFilterHintId}
                          onInteract={handleLanguageFilterInteract}
                          onTapeInteract={handleLanguageFilterTapeRemove}
                        />
                      </div>
                    </PreferenceRow>

                    <PreferenceRow
                      label="Corporate jargon suppression"
                      status={jargonSuppressionEnabled ? "On" : "Off"}
                      className="border-t border-white/8"
                    >
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <p id={jargonHintId} className="text-sm leading-6 text-[color:var(--text-muted)]">
                          {jargonSuppressionEnabled ? jargonSuppressionCopy.on : jargonSuppressionCopy.off}
                        </p>
                        <BrumbleSwitch
                          checked={jargonSuppressionEnabled}
                          label="Corporate jargon suppression"
                          ariaDescribedBy={jargonHintId}
                          onCheckedChange={handleJargonSuppressionChange}
                        />
                      </div>
                    </PreferenceRow>

                    <PreferenceRow
                      label="Small talk bandwidth"
                      status={smallTalkSelection.label}
                      className="border-t border-white/8"
                    >
                      <div className="mt-4 space-y-3">
                        <div
                          role="group"
                          aria-describedby={smallTalkHintId}
                          className="inline-flex w-full rounded-full border border-white/10 bg-black/18 p-1"
                        >
                          {smallTalkOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleSmallTalkModeChange(option.id)}
                              aria-pressed={smallTalkMode === option.id}
                              className={cn(
                                "flex-1 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition duration-[var(--motion-base)]",
                                smallTalkToneClasses[option.id].focus,
                                smallTalkMode === option.id
                                  ? smallTalkToneClasses[option.id].active
                                  : cn("text-[color:var(--text-muted)]", smallTalkToneClasses[option.id].hover),
                              )}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        <p id={smallTalkHintId} className="text-sm leading-6 text-[color:var(--text-muted)]">
                          {smallTalkSelection.helper}
                        </p>
                      </div>
                    </PreferenceRow>
                  </div>

                  <div className="mt-4 rounded-[1.25rem] border border-white/8 bg-black/10 px-4 py-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-white/38">
                      System note
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                      {communicationFooterMessage}
                    </p>
                  </div>
                </motion.section>
              </div>
            </div>
          </div>

          <p aria-live="polite" className="sr-only">{liveMessage}</p>
        </motion.section>
      </section>

      <ProfileReviewModal isOpen={isReviewOpen} hasAboutDraft={hasAboutDraft} onClose={() => setIsReviewOpen(false)} onReset={handleResetDraft} />
      {recoveryTriggered ? (
        <RecoveryTerminalOverlay onComplete={handleLanguageFilterRecoveryComplete} />
      ) : null}
    </>
  );
}

function ProfileFieldSurface({
  icon: Icon,
  label,
  helper,
  active = false,
  headerAction,
  className,
  children,
}: {
  icon?: LucideIcon;
  label: string;
  helper?: string;
  active?: boolean;
  headerAction?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("rounded-[1.7rem] border p-4 sm:p-5", active ? "border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(13,18,28,0.9))] shadow-[0_18px_46px_rgba(0,0,0,0.2)]" : "border-white/8 bg-black/10", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {Icon ? <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[color:var(--accent)]" /> : null}
          <div>
            <p className="eyebrow">{label}</p>
            {helper ? <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{helper}</p> : null}
          </div>
        </div>
        {headerAction}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PreferenceRow({
  label,
  status,
  helper,
  helperId,
  onStatusDoubleClick,
  className,
  children,
}: {
  label: string;
  status: string;
  helper?: string;
  helperId?: string;
  onStatusDoubleClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("px-4 py-4 sm:px-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {helper ? (
            <p
              id={helperId}
              className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]"
            >
              {helper}
            </p>
          ) : null}
        </div>
        {onStatusDoubleClick ? (
          <button
            type="button"
            onDoubleClick={onStatusDoubleClick}
            className="profile-comm-pills appearance-none cursor-default select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(156,174,212,0.22)]"
            aria-label={`${label} status ${status}`}
          >
            {status}
          </button>
        ) : (
          <span className="profile-comm-pills">
            {status}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function EditorButton({
  tone,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-[1rem] border px-4 py-2.5 text-sm font-medium transition duration-[var(--motion-base)]",
        tone === "primary"
          ? "border-[color:var(--accent-border)] bg-[linear-gradient(180deg,rgba(115,224,169,0.24),rgba(36,79,58,0.2))] text-[color:var(--accent-strong)] hover:-translate-y-0.5 hover:border-[rgba(152,235,192,0.36)] hover:shadow-[0_18px_40px_rgba(18,39,31,0.24)]"
          : tone === "secondary"
            ? "border-white/10 bg-white/[0.04] text-white/84 hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
            : "border-white/8 bg-black/12 text-[color:var(--text-muted)] hover:border-white/14 hover:bg-white/[0.05] hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function ProfileReviewModal({
  isOpen,
  hasAboutDraft,
  onClose,
  onReset,
}: {
  isOpen: boolean;
  hasAboutDraft: boolean;
  onClose: () => void;
  onReset: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const initialFocusTimeoutRef = useRef<number | null>(null);
  const restoreFocusTimeoutRef = useRef<number | null>(null);

  const statusLine = hasAboutDraft
    ? profileContent.playful.saveReview.aboutEdited
    : profileContent.playful.saveReview.empty;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    initialFocusTimeoutRef.current = window.setTimeout(() => {
      closeButtonRef.current?.focus();
      initialFocusTimeoutRef.current = null;
    }, 0);

    return () => {
      window.removeEventListener("keydown", onKeyDown);

      if (initialFocusTimeoutRef.current !== null) {
        window.clearTimeout(initialFocusTimeoutRef.current);
        initialFocusTimeoutRef.current = null;
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    if (restoreFocusTimeoutRef.current !== null) {
      window.clearTimeout(restoreFocusTimeoutRef.current);
    }

    restoreFocusTimeoutRef.current = window.setTimeout(() => {
      previouslyFocusedRef.current?.focus();
      restoreFocusTimeoutRef.current = null;
    }, 0);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (initialFocusTimeoutRef.current !== null) {
        window.clearTimeout(initialFocusTimeoutRef.current);
      }

      if (restoreFocusTimeoutRef.current !== null) {
        window.clearTimeout(restoreFocusTimeoutRef.current);
      }
    };
  }, []);

  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
    if (!focusableElements || focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0.08 : 0.16 }} className="fixed inset-0 z-[95] bg-[rgba(3,5,10,0.72)] px-4 py-6 backdrop-blur-md sm:px-6" onClick={onClose}>
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-review-title"
            aria-describedby="profile-review-body"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.985 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.2, ease: "easeOut" }}
            className="mx-auto mt-[10vh] w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,32,0.99),rgba(9,13,19,0.99))] shadow-[0_44px_120px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={trapFocus}
          >
            <div className="relative overflow-hidden border-b border-white/8 px-5 py-5 sm:px-6">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(149,173,226,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(63,87,136,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_34%)]" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white/64">
                    <Sparkles className="h-3.5 w-3.5 text-[color:var(--cool-accent)]" />
                    Local review
                  </div>
                  <h2 id="profile-review-title" className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[2rem]">
                    {profileContent.playful.saveReview.title}
                  </h2>
                </div>

                <button ref={closeButtonRef} type="button" onClick={onClose} className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-[color:var(--text-muted)] hover:border-white/16 hover:bg-white/[0.06] hover:text-white" aria-label="Close profile review">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
              <div className="rounded-[1.45rem] border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent-strong)]" />
                  <div id="profile-review-body">
                    <p className="text-sm font-semibold text-[color:var(--accent-strong)]">{statusLine}</p>
                    <p className="mt-2 text-sm leading-6 text-white/86">{profileContent.playful.saveReview.body}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/56">{profileContent.playful.saveReview.secondary}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <EditorButton tone="secondary" onClick={onClose}>Keep exploring</EditorButton>
                <EditorButton tone="primary" onClick={onReset}>Reset draft</EditorButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
