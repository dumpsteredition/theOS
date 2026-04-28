"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  MessageSquareText,
  MoreVertical,
  Plus,
  Search,
  SendHorizonal,
  SmilePlus,
  UserPlus,
  X,
} from "lucide-react";

import {
  getInboxSmartReply,
  inboxReactionOptions,
  inboxThreadSeeds,
  type InboxMessageSeed,
  type InboxThreadSeed,
} from "@/data/inbox-sim";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

type RailTone = "accent" | "cool" | "warm" | "neutral";

type InboxMessage = InboxMessageSeed & {
  reactions: string[];
  shareState?: string;
};

type InboxThread = Omit<InboxThreadSeed, "messages"> & {
  messages: InboxMessage[];
  draft: string;
  ambientMessagesSent: number;
  isTyping: boolean;
  pendingReply: boolean;
};

type ContactLeadValues = {
  name: string;
  email: string;
  companyOrProject: string;
  whatWorkingOn: string;
  helpNeeded: string;
  bestWayToReach: string;
  website: string;
};

type ContactLeadErrors = Partial<Record<keyof ContactLeadValues, string>>;

const sectionMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

const previewClampStyle: CSSProperties = {
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
};

const initialContactLeadValues: ContactLeadValues = {
  name: "",
  email: "",
  companyOrProject: "",
  whatWorkingOn: "",
  helpNeeded: "",
  bestWayToReach: "",
  website: "",
};

const ambientMessageDelayMinMs = 18000;
const ambientMessageDelayMaxMs = 34000;
const maxAmbientMessagesPerSession = 4;

function createInitialReplyCounts() {
  return inboxThreadSeeds.reduce<Record<string, number>>((counts, thread) => {
    counts[thread.id] = 0;
    return counts;
  }, {});
}

function createInitialThreads(): InboxThread[] {
  return inboxThreadSeeds.map((thread) => ({
    ...thread,
    draft: thread.draft ?? "",
    ambientMessagesSent: 0,
    isTyping: false,
    pendingReply: false,
    messages: thread.messages.map((message) => ({
      ...message,
      reactions: [...(message.reactions ?? [])],
    })),
  }));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDisplayName(name: string) {
  const parts = name
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

function buildContactThread(values: ContactLeadValues): InboxThread {
  const nowLabel = formatNowLabel();
  const threadId = `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const contactName = values.name.trim();
  const displayName = formatDisplayName(contactName);
  const whatWorkingOn = values.whatWorkingOn.trim();
  const helpNeeded = values.helpNeeded.trim();
  const summary = [whatWorkingOn, helpNeeded, "Kyle has the real version now."]
    .filter(Boolean)
    .join("\n\n");

  return {
    id: threadId,
    name: displayName || contactName,
    role: values.companyOrProject.trim() || "New contact",
    descriptor: "Kyle has the real version now.",
    initials: getInitials(displayName || contactName) || "NC",
    topic: "New conversation",
    statusLabel: "Contact request sent",
    railTime: "Now",
    unreadCount: 0,
    draft: "",
    accent: "#73e0a9",
    softAccent: "rgba(115, 224, 169, 0.16)",
    borderAccent: "rgba(115, 224, 169, 0.24)",
    ambientMessagesSent: 0,
    isTyping: false,
    pendingReply: false,
    behavior: {
      kind: "offline",
      label: "New contact",
      summary: "Kyle has the real version now. Future messages stay local unless you send them.",
      replies: false,
      typing: false,
      minDelayMs: 0,
      maxDelayMs: 0,
      replyPool: [],
    },
    messages: [
      {
        id: createMessageId(threadId),
        sender: "contact",
        body: summary,
        sentAt: nowLabel,
        reactions: [],
        shareState: "Shared on submit",
      },
    ],
  };
}

function getLastMessage(thread: InboxThread) {
  return thread.messages[thread.messages.length - 1] ?? null;
}

function getThreadState(thread: InboxThread) {
  const lastMessage = getLastMessage(thread);

  if (thread.isTyping) {
    return { label: "Typing", tone: "accent" as const };
  }

  if (thread.unreadCount > 0) {
    return {
      label: thread.unreadCount > 1 ? `${thread.unreadCount} unread` : "Unread",
      tone: "accent" as const,
    };
  }

  if (thread.draft.trim().length > 0) {
    return { label: "Draft", tone: "warm" as const };
  }

  if (lastMessage?.sender === "kyle" && thread.behavior.kind === "busy") {
    return { label: "Busy", tone: "warm" as const };
  }

  if (lastMessage?.sender === "kyle" && thread.behavior.kind === "offline") {
    return { label: "Offline", tone: "neutral" as const };
  }

  if (lastMessage?.sender === "kyle") {
    return { label: "Waiting", tone: "cool" as const };
  }

  if (thread.behavior.kind === "offline") {
    return { label: "Stale", tone: "neutral" as const };
  }

  if (thread.behavior.kind === "low-energy") {
    return { label: "Answered", tone: "neutral" as const };
  }

  return { label: "Active", tone: "cool" as const };
}

function getThreadPreview(thread: InboxThread) {
  if (thread.isTyping) {
    return `${thread.name.split(" ")[0]} is typing...`;
  }

  if (thread.draft.trim().length > 0) {
    return `Draft: ${thread.draft.trim()}`;
  }

  return getLastMessage(thread)?.body.replace(/\s+/g, " ").trim() ?? "";
}

function getToneClasses(tone: RailTone) {
  switch (tone) {
    case "accent":
      return "border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]";
    case "cool":
      return "border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] text-white/88";
    case "warm":
      return "border-[rgba(255,174,112,0.22)] bg-[rgba(255,174,112,0.14)] text-[#ffd8b8]";
    default:
      return "border-white/10 bg-white/[0.05] text-[color:var(--text-muted)]";
  }
}

function moveThreadToFront(threads: InboxThread[], threadId: string) {
  const thread = threads.find((item) => item.id === threadId);

  if (!thread) {
    return threads;
  }

  return [thread, ...threads.filter((item) => item.id !== threadId)];
}

function updateThread(
  threads: InboxThread[],
  threadId: string,
  updater: (thread: InboxThread) => InboxThread,
  moveToTop = false,
) {
  const nextThreads = threads.map((thread) =>
    thread.id === threadId ? updater(thread) : thread,
  );

  return moveToTop ? moveThreadToFront(nextThreads, threadId) : nextThreads;
}

function formatNowLabel() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function createMessageId(threadId: string) {
  return `${threadId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getRandomDelay(minDelayMs: number, maxDelayMs: number) {
  if (maxDelayMs <= minDelayMs) {
    return minDelayMs;
  }

  return Math.round(Math.random() * (maxDelayMs - minDelayMs) + minDelayMs);
}

function renderMessageBody(body: string) {
  return body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}

function validateContactLead(values: ContactLeadValues): ContactLeadErrors {
  const errors: ContactLeadErrors = {};

  if (!values.name.trim()) {
    errors.name = "Add a real name.";
  }

  if (!values.email.trim()) {
    errors.email = "Add an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Use a valid email address.";
  }

  if (!values.whatWorkingOn.trim()) {
    errors.whatWorkingOn = "Say what you are working on.";
  }

  if (!values.helpNeeded.trim()) {
    errors.helpNeeded = "Say what kind of help would be useful.";
  }

  return errors;
}

function buildMessageShareLabel(
  status: "sharing" | "shared" | "local-only" | "failed",
) {
  switch (status) {
    case "sharing":
      return "Sharing with Kyle";
    case "shared":
      return "Shared with Kyle";
    case "local-only":
      return "Sent locally only";
    default:
      return "Share failed";
  }
}

export function InboxView() {
  const reducedMotion = useReducedMotion();
  const { pushToast } = useToast();
  const [threads, setThreads] = useState<InboxThread[]>(() => createInitialThreads());
  const [replyCountsByThreadId, setReplyCountsByThreadId] =
    useState<Record<string, number>>(() => createInitialReplyCounts());
  const [selectedThreadId, setSelectedThreadId] = useState(inboxThreadSeeds[0]?.id ?? "");
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobileConversationOpen, setIsMobileConversationOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [contactLeadValues, setContactLeadValues] =
    useState<ContactLeadValues>(initialContactLeadValues);
  const [contactLeadErrors, setContactLeadErrors] = useState<ContactLeadErrors>({});
  const [contactSubmitError, setContactSubmitError] = useState<string | null>(null);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [activeReactionTarget, setActiveReactionTarget] = useState<{
    threadId: string;
    messageId: string;
  } | null>(null);
  const [, startThreadSwitch] = useTransition();
  const conversationViewportRef = useRef<HTMLDivElement | null>(null);
  const conversationShellRef = useRef<HTMLDivElement | null>(null);
  const mobileConversationViewportRef = useRef<HTMLDivElement | null>(null);
  const mobileConversationShellRef = useRef<HTMLDivElement | null>(null);
  const selectedThreadIdRef = useRef(selectedThreadId);
  const replyCountsRef = useRef(replyCountsByThreadId);
  const threadsRef = useRef<InboxThread[]>(threads);
  const timeoutIdsRef = useRef<number[]>([]);
  const ambientMessagesSentRef = useRef(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHasMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    selectedThreadIdRef.current = selectedThreadId;
  }, [selectedThreadId]);

  useEffect(() => {
    threadsRef.current = threads;
  }, [threads]);

  useEffect(() => {
    replyCountsRef.current = replyCountsByThreadId;
  }, [replyCountsByThreadId]);

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current;

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    if (!activeReactionTarget) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-reaction-anchor='true']")) {
        return;
      }

      setActiveReactionTarget(null);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [activeReactionTarget]);

  useEffect(() => {
    if (!isAddContactOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isSubmittingContact) {
          return;
        }

        setIsAddContactOpen(false);
        setContactLeadErrors({});
        setContactSubmitError(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAddContactOpen, isSubmittingContact]);

  const selectedThread =
    threads.find((thread) => thread.id === selectedThreadId) ?? threads[0] ?? null;
  const selectedMessageCount = selectedThread?.messages.length ?? 0;
  const selectedIsTyping = selectedThread?.isTyping ?? false;

  useEffect(() => {
    const viewports = [
      conversationViewportRef.current,
      mobileConversationViewportRef.current,
    ].filter(Boolean);

    if (viewports.length === 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      viewports.forEach((viewport) => {
        viewport?.scrollTo({
          top: viewport.scrollHeight,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [selectedThreadId, selectedMessageCount, selectedIsTyping, reducedMotion]);

  useEffect(() => {
    let isCancelled = false;
    let ambientTimeoutId: number | null = null;

    const scheduleAmbientMessage = () => {
      if (isCancelled || ambientMessagesSentRef.current >= maxAmbientMessagesPerSession) {
        return;
      }

      ambientTimeoutId = window.setTimeout(() => {
        if (isCancelled) {
          return;
        }

        const eligibleThreads = threadsRef.current.filter(
          (thread) =>
            (thread.ambientMessages?.length ?? 0) > 0 &&
            thread.ambientMessagesSent < (thread.ambientLimit ?? thread.ambientMessages?.length ?? 0) &&
            !thread.isTyping &&
            !thread.pendingReply,
        );

        if (eligibleThreads.length === 0) {
          return;
        }

        const thread =
          eligibleThreads[Math.floor(Math.random() * eligibleThreads.length)];
        const ambientMessages = thread.ambientMessages ?? [];
        const nextAmbientMessage =
          ambientMessages[thread.ambientMessagesSent % ambientMessages.length];

        if (!nextAmbientMessage) {
          scheduleAmbientMessage();
          return;
        }

        ambientMessagesSentRef.current += 1;

        setThreads((current) =>
          updateThread(
            current,
            thread.id,
            (currentThread) => ({
              ...currentThread,
              ambientMessagesSent: currentThread.ambientMessagesSent + 1,
              railTime: "Now",
              unreadCount:
                selectedThreadIdRef.current === currentThread.id
                  ? 0
                  : currentThread.unreadCount + 1,
              messages: [
                ...currentThread.messages,
                {
                  id: createMessageId(`${currentThread.id}-ambient`),
                  sender: "contact",
                  body: nextAmbientMessage,
                  sentAt: formatNowLabel(),
                  reactions: [],
                },
              ],
            }),
            true,
          ),
        );

        scheduleAmbientMessage();
      }, getRandomDelay(ambientMessageDelayMinMs, ambientMessageDelayMaxMs));
    };

    scheduleAmbientMessage();

    return () => {
      isCancelled = true;

      if (ambientTimeoutId) {
        window.clearTimeout(ambientTimeoutId);
      }
    };
  }, []);

  const scheduleTimeout = (callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== timeoutId);
      callback();
    }, delay);
    timeoutIdsRef.current.push(timeoutId);
  };

  const submitChatCapture = async (
    thread: InboxThread,
    messageId: string,
    visitorMessage: string,
  ) => {
    try {
      const response = await fetch("/api/inbox-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "inbox-chat",
          threadId: thread.id,
          threadName: thread.name,
          visitorMessage,
          timestamp: new Date().toISOString(),
          pagePath: window.location.pathname,
          userAgent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        setThreads((current) =>
          updateThread(current, thread.id, (currentThread) => ({
            ...currentThread,
            messages: currentThread.messages.map((message) =>
              message.id === messageId
                ? { ...message, shareState: buildMessageShareLabel("shared") }
                : message,
            ),
          })),
        );

        pushToast({
          title: "Message shared",
          body: "A real copy of that sent message was forwarded to Kyle.",
        });
        return;
      }

      setThreads((current) =>
        updateThread(current, thread.id, (currentThread) => ({
          ...currentThread,
          messages: currentThread.messages.map((message) =>
            message.id === messageId
              ? { ...message, shareState: buildMessageShareLabel("local-only") }
              : message,
          ),
        })),
      );

      pushToast({
        title: "Sent locally only",
        body: "The message stayed in the local surface because Inbox capture is not configured yet.",
      });
    } catch {
      setThreads((current) =>
        updateThread(current, thread.id, (currentThread) => ({
          ...currentThread,
          messages: currentThread.messages.map((message) =>
            message.id === messageId
              ? { ...message, shareState: buildMessageShareLabel("failed") }
              : message,
          ),
        })),
      );

      pushToast({
        title: "Share failed",
        body: "The message still appears locally, but forwarding it to Kyle did not work.",
      });
    }
  };

  const submitContactLead = async (values: ContactLeadValues) => {
    try {
      const response = await fetch("/api/inbox-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "add-contact",
          name: values.name.trim(),
          email: values.email.trim(),
          companyOrProject: values.companyOrProject.trim() || undefined,
          whatWorkingOn: values.whatWorkingOn.trim(),
          helpNeeded: values.helpNeeded.trim(),
          bestWayToReach: values.bestWayToReach.trim() || undefined,
          timestamp: new Date().toISOString(),
          pagePath: window.location.pathname,
          userAgent: navigator.userAgent,
          website: values.website.trim(),
        }),
      });

      if (response.ok) {
        const result = (await response.json().catch(() => null)) as {
          delivered?: boolean;
          configured?: boolean;
        } | null;

        if (result?.delivered === false && result.configured === false) {
          pushToast({
            title: "Contact route ready",
            body: "Delivery is not configured yet, but the request was handled cleanly.",
          });
          return true;
        }

        pushToast({
          title: "Contact request sent",
          body: "Kyle has the real version now.",
        });
        return true;
      }

      pushToast({
        title: "Couldn’t send that yet",
        body: "Try again in a minute.",
      });
      return false;
    } catch {
      pushToast({
        title: "Couldn’t send that yet",
        body: "Try again in a minute.",
      });
      return false;
    }
  };

  const handleSelectThread = (threadId: string) => {
    setActiveReactionTarget(null);
    setIsAddContactOpen(false);
    setThreads((current) =>
      updateThread(current, threadId, (thread) => ({ ...thread, unreadCount: 0 })),
    );
    startThreadSwitch(() => setSelectedThreadId(threadId));
    setIsMobileConversationOpen(true);

    if (window.innerWidth < 1024) {
      window.requestAnimationFrame(() => {
        mobileConversationShellRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
      return;
    }

    if (window.innerWidth < 1280) {
      window.requestAnimationFrame(() => {
        conversationShellRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  };

  const handleReturnToThreadList = () => {
    setActiveReactionTarget(null);
    setIsMobileConversationOpen(false);
  };

  const handleDraftChange = (nextDraft: string) => {
    if (!selectedThread) {
      return;
    }

    setThreads((current) =>
      updateThread(current, selectedThread.id, (thread) => ({
        ...thread,
        draft: nextDraft,
      })),
    );
  };

  const handleContactFieldChange = (
    field: keyof ContactLeadValues,
    value: string,
  ) => {
    setContactLeadValues((current) => ({ ...current, [field]: value }));
    setContactLeadErrors((current) => ({ ...current, [field]: undefined }));
    setContactSubmitError(null);
  };

  const handleToggleReactionPicker = (threadId: string, messageId: string) => {
    setActiveReactionTarget((current) =>
      current?.threadId === threadId && current.messageId === messageId
        ? null
        : { threadId, messageId },
    );
  };

  const handleReactToMessage = (threadId: string, messageId: string, emoji: string) => {
    setThreads((current) =>
      updateThread(
        current,
        threadId,
        (thread) => ({
          ...thread,
          messages: thread.messages.map((message) =>
            message.id !== messageId
              ? message
              : {
                  ...message,
                  reactions: message.reactions.includes(emoji)
                    ? message.reactions.filter((reaction) => reaction !== emoji)
                    : [...message.reactions, emoji],
                },
          ),
        }),
        true,
      ),
    );
    setActiveReactionTarget(null);
  };

  const handleCloseAddContactModal = () => {
    if (isSubmittingContact) {
      return;
    }

    setIsAddContactOpen(false);
    setContactLeadErrors({});
    setContactSubmitError(null);
  };

  const handleAddContactSubmit = async () => {
    const errors = validateContactLead(contactLeadValues);
    setContactLeadErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmittingContact(true);
    setContactSubmitError(null);

    const nextThread = buildContactThread(contactLeadValues);
    const didSend = await submitContactLead(contactLeadValues);

    if (!didSend) {
      setContactSubmitError("Couldn’t send that yet. Try again in a minute.");
      setIsSubmittingContact(false);
      return;
    }

    setThreads((current) => [nextThread, ...current]);
    setReplyCountsByThreadId((current) => ({ ...current, [nextThread.id]: 0 }));
    setSelectedThreadId(nextThread.id);
    setIsMobileConversationOpen(true);
    setIsAddContactOpen(false);
    setContactLeadValues(initialContactLeadValues);
    setContactLeadErrors({});
    setIsSubmittingContact(false);
  };

  const handleSendMessage = () => {
    if (!selectedThread) {
      return;
    }

    const draft = selectedThread.draft.trim();

    if (!draft) {
      return;
    }

    const messageId = createMessageId(selectedThread.id);
    const sentAt = formatNowLabel();
    const hadPendingReply = selectedThread.pendingReply;
    const replyCount = replyCountsRef.current[selectedThread.id] ?? 0;
    const smartReply: ReturnType<typeof getInboxSmartReply> = hadPendingReply
      ? {
          shouldReply: false,
          statusText: selectedThread.behavior.markSeen?.label ?? "Seen",
          detectedIntents: ["default"],
          delayMs: selectedThread.behavior.markSeen
            ? getRandomDelay(
                selectedThread.behavior.markSeen.minDelayMs,
                selectedThread.behavior.markSeen.maxDelayMs,
              )
            : 900,
          typing: false,
        }
      : getInboxSmartReply(selectedThread, draft, { replyCount });
    const shouldHoldPendingReply =
      smartReply.shouldReply || Boolean(smartReply.statusText);

    setThreads((current) =>
      updateThread(
        current,
        selectedThread.id,
        (thread) => ({
          ...thread,
          draft: "",
          railTime: "Now",
          unreadCount: 0,
          pendingReply: shouldHoldPendingReply ? true : thread.pendingReply,
          messages: [
            ...thread.messages,
            {
              id: messageId,
              sender: "kyle",
              body: draft,
              sentAt,
              reactions: [],
              deliveryState: "Sent",
              shareState: buildMessageShareLabel("sharing"),
            },
          ],
        }),
        true,
      ),
    );

    setActiveReactionTarget(null);

    void submitChatCapture(selectedThread, messageId, draft);

    if (smartReply.shouldReply && smartReply.replyText) {
      const typingLeadMs = smartReply.typing
        ? Math.min(700, Math.max(220, Math.round(smartReply.delayMs * 0.18)))
        : 0;

      if (smartReply.typing) {
        scheduleTimeout(() => {
          setThreads((current) =>
            updateThread(current, selectedThread.id, (thread) => ({
              ...thread,
              isTyping: true,
            })),
          );
        }, typingLeadMs);
      }

      scheduleTimeout(() => {
        const isActiveThread = selectedThreadIdRef.current === selectedThread.id;

        setThreads((current) =>
          updateThread(
            current,
            selectedThread.id,
            (thread) => ({
              ...thread,
              isTyping: false,
              pendingReply: false,
              railTime: "Now",
              unreadCount: isActiveThread ? 0 : thread.unreadCount + 1,
              messages: [
                ...thread.messages,
                {
                  id: createMessageId(`${selectedThread.id}-reply`),
                  sender: "contact",
                  body: smartReply.replyText ?? "",
                  sentAt: formatNowLabel(),
                  reactions: [],
                },
              ],
            }),
            true,
          ),
        );
        setReplyCountsByThreadId((current) => ({
          ...current,
          [selectedThread.id]: (current[selectedThread.id] ?? 0) + 1,
        }));
      }, smartReply.delayMs);
      return;
    }

    if (smartReply.statusText) {
      const applyNoReplyStatus = () => {
        const shouldPreservePendingState = hadPendingReply;
        setThreads((current) =>
          updateThread(current, selectedThread.id, (thread) => ({
            ...thread,
            isTyping: shouldPreservePendingState ? thread.isTyping : false,
            pendingReply: shouldPreservePendingState ? thread.pendingReply : false,
            messages: thread.messages.map((message) =>
              message.id === messageId
                ? { ...message, deliveryState: smartReply.statusText ?? message.deliveryState }
                : message,
            ),
          })),
        );
      };

      if (smartReply.delayMs > 0) {
        scheduleTimeout(applyNoReplyStatus, smartReply.delayMs);
      } else {
        applyNoReplyStatus();
      }
      return;
    }

    setThreads((current) =>
      updateThread(current, selectedThread.id, (thread) => ({
        ...thread,
        pendingReply: hadPendingReply ? thread.pendingReply : false,
      })),
    );
  };

  const handleComposerKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    handleSendMessage();
  };

  if (!selectedThread) {
    return null;
  }

  const selectedThreadState = getThreadState(selectedThread);
  const canSend = selectedThread.draft.trim().length > 0;

  return (
    <section className="min-h-0">
      <motion.section
        {...sectionMotion}
        className="relative h-[calc(100svh-12rem)] max-h-[calc(100svh-12rem)] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0b0c10] shadow-[0_24px_70px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.06)] lg:hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {!isMobileConversationOpen ? (
            <motion.div
              key="mobile-thread-list"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.2, ease: "easeOut" }}
              className="flex h-full min-h-0 flex-col bg-[#0b0c10]"
            >
              <header className="shrink-0 px-4 pb-3 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-[1.7rem] font-semibold leading-none tracking-normal text-white">
                    Messages
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/72 transition duration-[var(--motion-base)] active:bg-white/10 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                      aria-label="Search messages"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddContactOpen(true)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1f6feb] text-white shadow-[0_8px_22px_rgba(31,111,235,0.28)] transition duration-[var(--motion-base)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                      aria-label="Add contact"
                    >
                      <UserPlus className="h-[1.125rem] w-[1.125rem]" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 flex h-12 w-full items-center gap-3 rounded-full bg-[#1b1d22] px-4 text-left text-sm text-white/58 transition duration-[var(--motion-base)] active:bg-[#23262d] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                  aria-label="Search messages"
                >
                  <Search className="h-[1.125rem] w-[1.125rem] text-white/42" />
                  <span>Search messages</span>
                </button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
                {threads.length > 0 ? (
                  <div className="space-y-0.5">
                    {threads.map((thread) => (
                      <MobileThreadRow
                        key={thread.id}
                        thread={thread}
                        isActive={thread.id === selectedThread.id}
                        onSelect={() => handleSelectThread(thread.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mx-2 rounded-[1.25rem] bg-white/[0.06] p-4 text-sm leading-6 text-white/64">
                    No threads yet. Add a contact to start a new conversation.
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsAddContactOpen(true)}
                className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#8ab4f8] px-4 text-sm font-semibold text-[#08131f] shadow-[0_14px_34px_rgba(0,0,0,0.38)] transition duration-[var(--motion-base)] active:scale-95 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
              >
                <Plus className="h-5 w-5" />
                Start chat
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="mobile-conversation"
              ref={mobileConversationShellRef}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 14 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.2, ease: "easeOut" }}
              className="flex h-full min-h-0 flex-col overflow-hidden bg-[#0b0c10]"
            >
              <header className="flex min-h-16 shrink-0 items-center gap-2 border-b border-white/[0.06] px-2.5 py-2">
                <button
                  type="button"
                  onClick={handleReturnToThreadList}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/78 transition duration-[var(--motion-base)] active:bg-white/10 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                  aria-label="Back to messages"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{
                    background: `linear-gradient(180deg, ${selectedThread.softAccent}, rgba(40,44,52,0.96))`,
                    boxShadow: `inset 0 0 0 1px ${selectedThread.borderAccent}`,
                  }}
                >
                  {selectedThread.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold tracking-normal text-white">
                    {selectedThread.name}
                  </h3>
                  <p className="truncate text-xs text-white/52">
                    {selectedThread.isTyping ? "Typing..." : selectedThread.role}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/68 transition duration-[var(--motion-base)] active:bg-white/10 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                  aria-label="Conversation options"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </header>

              <div
                ref={mobileConversationViewportRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4"
              >
                <div className="space-y-3">
                  {selectedThread.messages.map((message) => (
                    <MobileConversationMessage
                      key={message.id}
                      thread={selectedThread}
                      message={message}
                      isReactionOpen={
                        activeReactionTarget?.threadId === selectedThread.id &&
                        activeReactionTarget.messageId === message.id
                      }
                      onToggleReactionPicker={handleToggleReactionPicker}
                      onReact={handleReactToMessage}
                    />
                  ))}

                  {selectedThread.isTyping ? (
                    <TypingIndicator
                      name={selectedThread.name}
                      accent={selectedThread.accent}
                      borderAccent={selectedThread.borderAccent}
                      softAccent={selectedThread.softAccent}
                    />
                  ) : null}
                </div>
              </div>

              <div className="shrink-0 border-t border-white/[0.06] bg-[#0b0c10] px-2.5 py-2.5">
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddContactOpen(true)}
                    className="mb-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/66 transition duration-[var(--motion-base)] active:bg-white/10 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                    aria-label="Add contact"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  <label htmlFor="mobile-inbox-composer" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="mobile-inbox-composer"
                    value={selectedThread.draft}
                    onChange={(event) => handleDraftChange(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows={1}
                    placeholder="Text message"
                    className="max-h-28 min-h-11 flex-1 resize-none rounded-[1.4rem] border border-transparent bg-[#1b1d22] px-4 py-3 text-sm leading-5 text-white outline-none placeholder:text-white/44 focus:border-[#8ab4f8]/50 focus:ring-2 focus:ring-[#8ab4f8]/30"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!canSend}
                    className="mb-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8ab4f8] text-[#07121f] transition duration-[var(--motion-base)] active:scale-95 disabled:bg-[#2b2f36] disabled:text-white/34 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)]"
                    aria-label="Send message"
                  >
                    <SendHorizonal className="h-[1.125rem] w-[1.125rem]" />
                  </button>
                </div>
                <p className="ml-14 mt-1 text-[0.68rem] text-white/34">
                  May reach Kyle.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <motion.section
        {...sectionMotion}
        className="hidden h-[calc(100svh-12rem)] max-h-[calc(100svh-12rem)] min-h-[38rem] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(12,18,29,0.98),rgba(5,8,14,0.98)_48%,rgba(10,17,27,0.98))] shadow-[0_28px_82px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] lg:block"
      >
        <div className="grid h-full min-h-0 grid-cols-[minmax(320px,360px)_minmax(0,1fr)] xl:grid-cols-[minmax(340px,380px)_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(8,12,19,0.86)_38%,rgba(5,8,14,0.96))]">
            <div className="shrink-0 border-b border-white/8 px-5 py-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <MessageSquareText className="h-4 w-4 text-[color:var(--accent)]" />
                    <p className="eyebrow">Communication</p>
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    Inbox
                  </h3>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setIsAddContactOpen(true)}
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition duration-[var(--motion-base)] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13]",
                    isAddContactOpen
                      ? "border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                      : "border-[color:var(--accent-border)] bg-[linear-gradient(180deg,rgba(147,184,255,0.2),rgba(147,184,255,0.08))] text-white hover:brightness-110",
                  )}
                  whileHover={reducedMotion ? undefined : { scale: 1.04, y: -1 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                  aria-label="Add contact"
                >
                  <UserPlus className="h-[1.125rem] w-[1.125rem]" />
                </motion.button>
              </div>

              <button
                type="button"
                onClick={() => setIsAddContactOpen(true)}
                className="mt-5 flex w-full items-center justify-between gap-3 rounded-[1.15rem] border border-white/10 bg-white/[0.045] px-4 py-3 text-left transition duration-[var(--motion-base)] hover:border-[color:var(--accent-border)] hover:bg-[color:var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13]"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">Add contact</span>
                  <span className="mt-0.5 block truncate text-xs text-white/48">
                    Start a real thread with Kyle.
                  </span>
                </span>
                <Plus className="h-4 w-4 shrink-0 text-[color:var(--accent-strong)]" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
              {threads.length > 0 ? (
                <div className="space-y-1.5">
                  {threads.map((thread) => (
                    <ThreadRailButton
                      key={thread.id}
                      thread={thread}
                      isActive={thread.id === selectedThread.id}
                      onSelect={() => handleSelectThread(thread.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-[color:var(--text-muted)]">
                  No threads yet. Add a contact to start a new conversation.
                </div>
              )}
            </div>
          </aside>

          <div ref={conversationShellRef} className="flex h-full min-h-0 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-white/8 bg-[rgba(8,12,19,0.58)] px-7 py-5 backdrop-blur-xl">
              <div className="flex min-w-0 items-center justify-between gap-5">
                <div className="flex min-w-0 items-center gap-3.5">
                  <div
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-semibold text-white"
                    style={{
                      borderColor: selectedThread.borderAccent,
                      background: `linear-gradient(180deg, ${selectedThread.softAccent}, rgba(14, 20, 31, 0.96))`,
                      boxShadow: `0 0 28px ${selectedThread.softAccent}`,
                    }}
                  >
                    {selectedThread.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <h3 className="truncate text-2xl font-semibold tracking-[-0.04em] text-white">
                        {selectedThread.name}
                      </h3>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em]",
                          getToneClasses(selectedThreadState.tone),
                        )}
                      >
                        {selectedThreadState.label}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-white/58">
                      {selectedThread.role} · {selectedThread.behavior.label}
                    </p>
                  </div>
                </div>
                <p className="max-w-[22rem] truncate text-right text-xs leading-5 text-white/38">
                  {selectedThread.descriptor}
                </p>
              </div>
            </div>

            <div
              ref={conversationViewportRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[radial-gradient(circle_at_50%_0%,rgba(147,184,255,0.08),transparent_34%),linear-gradient(180deg,rgba(9,14,23,0.84),rgba(5,8,14,0.94))] px-7 py-7"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedThread.id}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reducedMotion ? 0.12 : 0.2, ease: "easeOut" }}
                  className="mx-auto flex min-h-full w-full max-w-[58rem] flex-col justify-end gap-5"
                >
                  {selectedThread.messages.map((message) => (
                    <ConversationMessage
                      key={message.id}
                      thread={selectedThread}
                      message={message}
                      isReactionOpen={
                        activeReactionTarget?.threadId === selectedThread.id &&
                        activeReactionTarget.messageId === message.id
                      }
                      onToggleReactionPicker={handleToggleReactionPicker}
                      onReact={handleReactToMessage}
                    />
                  ))}

                  {selectedThread.isTyping ? (
                    <TypingIndicator
                      name={selectedThread.name}
                      accent={selectedThread.accent}
                      borderAccent={selectedThread.borderAccent}
                      softAccent={selectedThread.softAccent}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="shrink-0 border-t border-white/8 bg-[linear-gradient(180deg,rgba(9,14,23,0.92),rgba(5,8,14,0.98))] px-7 py-5 backdrop-blur-xl">
              <div className="mx-auto max-w-[58rem]">
                <div className="flex items-end gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <label htmlFor="inbox-composer" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="inbox-composer"
                    value={selectedThread.draft}
                    onChange={(event) => handleDraftChange(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows={2}
                    placeholder="Message Kyle..."
                    className="max-h-36 min-h-[3.25rem] flex-1 resize-none rounded-[1.15rem] border border-transparent bg-transparent px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/38 focus:border-[color:var(--accent-border)] focus:bg-black/10 focus:ring-2 focus:ring-[color:var(--focus-ring)]"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!canSend}
                    aria-label="Send message"
                    className="mb-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] transition duration-[var(--motion-base)] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13] disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-white/[0.05] disabled:text-white/28"
                  >
                    <SendHorizonal className="h-[1.125rem] w-[1.125rem]" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-4 px-2">
                  <p className="text-xs leading-5 text-white/42">
                    Sent messages may be shared with Kyle.
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                    Enter sends · Shift+Enter adds a line
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {hasMounted
        ? createPortal(
      <AnimatePresence initial={false}>
        {isAddContactOpen ? (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.12 : 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-[rgba(3,7,13,0.72)] p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:items-center sm:p-6"
            onClick={handleCloseAddContactModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-contact-title"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.2, ease: "easeOut" }}
              className="flex max-h-[min(760px,calc(100svh_-_2rem))] w-full max-w-[38rem] flex-col overflow-hidden rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,28,43,0.96),rgba(7,11,18,0.98))] shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:max-h-[min(760px,calc(100svh_-_3rem))] sm:rounded-[1.9rem]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="border-b border-white/8 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Add Contact</p>
                    <h3
                      id="add-contact-title"
                      className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl"
                    >
                      <span className="sm:hidden">Start a real thread.</span>
                      <span className="hidden sm:inline">Put a real person into the rail.</span>
                    </h3>
                    <p className="mt-2 max-w-[32rem] text-sm leading-6 text-[color:var(--text-muted)]">
                      <span className="sm:hidden">
                        Add the useful version of the brief.
                      </span>
                      <span className="hidden sm:inline">
                        Add yourself to the Inbox, leave the useful version of the brief, and Kyle gets the real details only when you submit.
                      </span>
                    </p>
                    <p className="mt-2 hidden text-xs leading-5 text-white/42 sm:block">
                      Rail display uses first name plus last initial.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseAddContactModal}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[color:var(--text-muted)] transition duration-[var(--motion-base)] hover:border-white/14 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13]"
                    aria-label="Close add contact modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                <div className="grid gap-3">
                  <ContactLeadField
                    label="Name"
                    value={contactLeadValues.name}
                    error={contactLeadErrors.name}
                    placeholder="Who should Kyle know this thread belongs to?"
                    onChange={(value) => handleContactFieldChange("name", value)}
                  />
                  <ContactLeadField
                    label="Email"
                    value={contactLeadValues.email}
                    error={contactLeadErrors.email}
                    placeholder="The inbox Kyle should reply to."
                    inputType="email"
                    onChange={(value) => handleContactFieldChange("email", value)}
                  />
                  <ContactLeadField
                    label="Company / Project"
                    value={contactLeadValues.companyOrProject}
                    error={contactLeadErrors.companyOrProject}
                    placeholder="Optional, but useful."
                    onChange={(value) => handleContactFieldChange("companyOrProject", value)}
                  />
                  <ContactLeadField
                    label="What are you working on?"
                    value={contactLeadValues.whatWorkingOn}
                    error={contactLeadErrors.whatWorkingOn}
                    placeholder="Give the honest version, not the investor headline."
                    multiline
                    onChange={(value) => handleContactFieldChange("whatWorkingOn", value)}
                  />
                  <ContactLeadField
                    label="Help needed"
                    value={contactLeadValues.helpNeeded}
                    error={contactLeadErrors.helpNeeded}
                    placeholder="Where would Kyle be useful?"
                    multiline
                    onChange={(value) => handleContactFieldChange("helpNeeded", value)}
                  />
                  <ContactLeadField
                    label="Best way to reach"
                    value={contactLeadValues.bestWayToReach}
                    error={contactLeadErrors.bestWayToReach}
                    placeholder="Optional: email, LinkedIn, or the place you actually check."
                    onChange={(value) => handleContactFieldChange("bestWayToReach", value)}
                  />
                  <div className="hidden" aria-hidden="true">
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={contactLeadValues.website}
                        onChange={(event) =>
                          handleContactFieldChange("website", event.target.value)
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/8 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-3">
                  <p className="text-xs leading-5 text-white/42">
                    <span className="sm:hidden">Sends this to Kyle.</span>
                    <span className="hidden sm:inline">
                      Submitting this sends the real version to Kyle.
                    </span>
                  </p>
                  {contactSubmitError ? (
                    <p className="rounded-[1rem] border border-red-300/16 bg-red-500/8 px-3 py-2 text-xs leading-5 text-red-100/86">
                      {contactSubmitError}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                      type="button"
                      onClick={handleAddContactSubmit}
                      disabled={isSubmittingContact}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-4 py-2.5 text-sm font-medium text-[color:var(--accent-strong)] transition duration-[var(--motion-base)] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {isSubmittingContact ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      {isSubmittingContact ? "Sending..." : "Add contact"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseAddContactModal}
                      disabled={isSubmittingContact}
                      className="hidden min-h-11 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-[color:var(--text-muted)] transition duration-[var(--motion-base)] hover:border-white/14 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13] sm:inline-block"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
          document.body,
        )
        : null}
    </section>
  );
}

function ThreadRailButton({
  thread,
  isActive,
  onSelect,
}: {
  thread: InboxThread;
  isActive: boolean;
  onSelect: () => void;
}) {
  const state = getThreadState(thread);
  const preview = getThreadPreview(thread);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        "relative w-full overflow-hidden rounded-[1.25rem] border px-3 py-3 text-left transition duration-[var(--motion-base)] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13]",
        isActive
          ? "shadow-[0_14px_34px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.055)]"
          : "hover:border-white/12 hover:bg-white/[0.045]",
      )}
      style={{
        borderColor: isActive ? thread.borderAccent : "rgba(255,255,255,0.08)",
        background: isActive
          ? `linear-gradient(135deg, ${thread.softAccent}, rgba(12, 18, 28, 0.88))`
          : "rgba(255,255,255,0.02)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-4 left-0 w-[3px] rounded-r-full"
        style={{
          backgroundColor: thread.accent,
          opacity: isActive ? 0.95 : 0,
        }}
      />
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold text-white"
          style={{
            borderColor: thread.borderAccent,
            background: `linear-gradient(180deg, ${thread.softAccent}, rgba(14,20,31,0.96))`,
          }}
        >
          {thread.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[0.95rem] font-semibold tracking-normal text-white">
                {thread.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/46">
                {thread.role} · {state.label}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="text-xs font-medium text-white/40">{thread.railTime}</span>
              {thread.unreadCount > 0 ? (
                <span
                  className="flex min-h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.68rem] font-semibold text-[#07121f]"
                  style={{ backgroundColor: thread.accent }}
                >
                  {thread.unreadCount}
                </span>
              ) : null}
            </div>
          </div>

          <p
            className={cn(
              "mt-2 text-sm leading-5",
              thread.unreadCount > 0 ? "text-white/92" : "text-[color:var(--text-muted)]",
            )}
            style={previewClampStyle}
          >
            {preview}
          </p>

          <div className="mt-2.5 flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full",
                state.tone === "accent"
                  ? "bg-[color:var(--accent)]"
                  : state.tone === "warm"
                    ? "bg-[#ffae70]"
                    : state.tone === "cool"
                      ? "bg-[#93b8ff]"
                      : "bg-white/24",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "truncate text-xs",
                thread.unreadCount > 0 ? "text-white/62" : "text-white/36",
              )}
            >
              {thread.statusLabel}
            </span>
            {thread.draft.trim().length > 0 ? (
              <span
                className={cn(
                  "ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[0.65rem]",
                  getToneClasses(state.tone),
                )}
              >
                Draft
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function MobileThreadRow({
  thread,
  isActive,
  onSelect,
}: {
  thread: InboxThread;
  isActive: boolean;
  onSelect: () => void;
}) {
  const state = getThreadState(thread);
  const preview = getThreadPreview(thread);
  const lastMessage = getLastMessage(thread);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        "grid w-full grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-[1.35rem] px-3 py-2.5 text-left transition duration-[var(--motion-base)] active:bg-white/[0.075] focus-visible:ring-2 focus-visible:ring-[#8ab4f8]",
        isActive ? "bg-white/[0.07]" : "bg-transparent",
      )}
    >
      <div
        aria-hidden="true"
        className="relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{
          background: `linear-gradient(180deg, ${thread.softAccent}, rgba(36,40,48,0.96))`,
          boxShadow: `inset 0 0 0 1px ${thread.borderAccent}`,
        }}
      >
        {thread.initials}
        {thread.unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0b0c10] bg-[#8ab4f8]" />
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-[0.96rem] font-semibold tracking-normal text-white">
            {thread.name}
          </p>
          {thread.isTyping ? (
            <span className="shrink-0 rounded-full bg-[#12335d] px-2 py-0.5 text-[0.64rem] font-medium text-[#8ab4f8]">
              typing
            </span>
          ) : null}
        </div>
        <p
          className={cn(
            "mt-0.5 text-sm leading-5",
            thread.unreadCount > 0 ? "font-medium text-white/86" : "text-white/52",
          )}
          style={previewClampStyle}
        >
          {preview}
        </p>
        <p className="mt-0.5 truncate text-xs text-white/34">
          {state.label} · {thread.role}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2 self-start pt-1">
        <span className="text-xs text-white/42">{thread.railTime}</span>
        {thread.unreadCount > 0 ? (
          <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#8ab4f8] px-1.5 text-[0.68rem] font-semibold text-[#07121f]">
            {thread.unreadCount}
          </span>
        ) : lastMessage?.sender === "kyle" ? (
          <span className="h-2 w-2 rounded-full bg-white/22" aria-hidden="true" />
        ) : null}
      </div>
    </button>
  );
}

function MobileConversationMessage({
  thread,
  message,
  isReactionOpen,
  onToggleReactionPicker,
  onReact,
}: {
  thread: InboxThread;
  message: InboxMessage;
  isReactionOpen: boolean;
  onToggleReactionPicker: (threadId: string, messageId: string) => void;
  onReact: (threadId: string, messageId: string, emoji: string) => void;
}) {
  const isKyle = message.sender === "kyle";
  const reducedMotion = useReducedMotion();
  const messageMeta = [message.shareState, message.deliveryState].filter(Boolean).join(" · ");

  return (
    <motion.article
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.12 : 0.18, ease: "easeOut" }}
      className={cn("flex min-w-0", isKyle ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "group flex max-w-[84%] flex-col",
          isKyle ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "min-w-0 rounded-[1.35rem] px-3.5 py-2.5 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [overflow-wrap:anywhere]",
            isKyle
              ? "rounded-br-md bg-[#8ab4f8] text-[#07121f]"
              : "rounded-bl-md bg-[#202329] text-white/88",
          )}
        >
          <div className="space-y-2">{renderMessageBody(message.body)}</div>
        </div>

        <div
          data-reaction-anchor="true"
          className={cn(
            "relative mt-1.5 flex flex-wrap items-center gap-1.5",
            isKyle ? "justify-end" : "justify-start",
          )}
        >
          {message.reactions.map((reaction) => (
            <motion.button
              key={reaction}
              type="button"
              onClick={() => onReact(thread.id, message.id, reaction)}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="rounded-full border border-white/10 bg-[#1b1d22] px-2 py-0.5 text-xs text-white/86 focus-visible:ring-2 focus-visible:ring-[#8ab4f8]"
              aria-label={`Toggle ${reaction} reaction`}
            >
              {reaction}
            </motion.button>
          ))}

          <button
            type="button"
            data-reaction-anchor="true"
            onClick={() => onToggleReactionPicker(thread.id, message.id)}
            className="inline-flex min-h-7 items-center gap-1 rounded-full px-2 py-1 text-[0.68rem] font-medium text-white/42 transition duration-[var(--motion-base)] active:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#8ab4f8]"
            aria-label="Open reaction picker"
          >
            <SmilePlus className="h-3.5 w-3.5" />
            React
          </button>

          <AnimatePresence>
            {isReactionOpen ? (
              <motion.div
                data-reaction-anchor="true"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className={cn(
                  "absolute bottom-full z-20 mb-2 flex max-w-[calc(100vw-3rem)] items-center gap-1 rounded-full border border-white/10 bg-[#202329] p-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.34)]",
                  isKyle ? "right-0" : "left-0",
                )}
              >
                {inboxReactionOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    data-reaction-anchor="true"
                    onClick={() => onReact(thread.id, message.id, emoji)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition duration-[var(--motion-base)] active:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#8ab4f8]"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <p
          className={cn(
            "mt-0.5 max-w-full truncate text-[0.66rem] text-white/34",
            isKyle ? "text-right" : "text-left",
          )}
        >
          {messageMeta || message.sentAt}
        </p>
      </div>
    </motion.article>
  );
}

function ConversationMessage({
  thread,
  message,
  isReactionOpen,
  onToggleReactionPicker,
  onReact,
}: {
  thread: InboxThread;
  message: InboxMessage;
  isReactionOpen: boolean;
  onToggleReactionPicker: (threadId: string, messageId: string) => void;
  onReact: (threadId: string, messageId: string, emoji: string) => void;
}) {
  const isKyle = message.sender === "kyle";
  const reducedMotion = useReducedMotion();
  const messageMeta = [message.shareState, message.deliveryState].filter(Boolean).join(" · ");

  return (
    <motion.article
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0.12 : 0.18, ease: "easeOut" }}
      className={cn("flex min-w-0", isKyle ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "group flex min-w-0 max-w-[min(40rem,78%)] flex-col",
          isKyle ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "min-w-0 rounded-[1.35rem] px-4 py-3 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] [overflow-wrap:anywhere] xl:px-5 xl:py-3.5 xl:leading-7",
            isKyle
              ? "rounded-br-md bg-[linear-gradient(180deg,rgba(147,184,255,0.9),rgba(126,164,235,0.88))] text-[#06111e]"
              : "rounded-bl-md border border-white/8 bg-[rgba(255,255,255,0.07)] text-white/88",
          )}
        >
          <div className="space-y-3">
            {renderMessageBody(message.body)}
          </div>
        </div>

        <div
          data-reaction-anchor="true"
          className={cn(
            "relative mt-2 flex flex-wrap items-center gap-1.5",
            isKyle ? "justify-end" : "justify-start",
          )}
        >
          {message.reactions.map((reaction) => (
            <motion.button
              key={reaction}
              type="button"
              onClick={() => onReact(thread.id, message.id, reaction)}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="rounded-full border border-white/10 bg-[rgba(8,12,19,0.72)] px-2.5 py-1 text-sm text-white/86 transition duration-[var(--motion-base)] hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13]"
              aria-label={`Toggle ${reaction} reaction`}
            >
              {reaction}
            </motion.button>
          ))}

          <button
            type="button"
            data-reaction-anchor="true"
            onClick={() => onToggleReactionPicker(thread.id, message.id)}
            className="inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-white/38 opacity-100 transition duration-[var(--motion-base)] hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
            aria-label="Open reaction picker"
          >
            <SmilePlus className="h-3.5 w-3.5" />
            React
          </button>

          <AnimatePresence>
            {isReactionOpen ? (
              <motion.div
                data-reaction-anchor="true"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className={cn(
                  "absolute bottom-full z-20 mb-2 flex max-w-[calc(100vw-3rem)] flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-[rgba(8,12,19,0.98)] p-1.5 shadow-[0_16px_38px_rgba(0,0,0,0.36)]",
                  isKyle ? "right-0" : "left-0",
                )}
              >
                {inboxReactionOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    data-reaction-anchor="true"
                    onClick={() => onReact(thread.id, message.id, emoji)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-lg transition duration-[var(--motion-base)] hover:border-white/10 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c13]"
                    aria-label={`React with ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <p
          className={cn(
            "mt-1 max-w-full truncate text-xs text-white/34",
            isKyle ? "text-right" : "text-left",
          )}
        >
          {messageMeta || message.sentAt}
        </p>
      </div>
    </motion.article>
  );
}

function ContactLeadField({
  label,
  value,
  error,
  placeholder,
  inputType = "text",
  multiline = false,
  autoFocus = false,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  inputType?: "email" | "text";
  multiline?: boolean;
  autoFocus?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white">{label}</span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={cn(
            "min-h-[96px] rounded-[1.1rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,11,18,0.9))] px-4 py-3 text-sm leading-6 text-white placeholder:text-[color:var(--text-muted)] outline-none transition duration-[var(--motion-base)] hover:border-white/14 focus:border-[color:var(--accent-border)] focus:ring-2 focus:ring-[color:var(--focus-ring)]",
            error ? "border-red-400/60" : "border-white/8",
          )}
        />
      ) : (
        <input
          type={inputType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={cn(
            "rounded-[1.1rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,11,18,0.9))] px-4 py-3 text-sm text-white placeholder:text-[color:var(--text-muted)] outline-none transition duration-[var(--motion-base)] hover:border-white/14 focus:border-[color:var(--accent-border)] focus:ring-2 focus:ring-[color:var(--focus-ring)]",
            error ? "border-red-400/60" : "border-white/8",
          )}
        />
      )}
      {error ? <p className="text-xs leading-5 text-red-200">{error}</p> : null}
    </label>
  );
}

function TypingIndicator({
  name,
  accent,
  borderAccent,
  softAccent,
}: {
  name: string;
  accent: string;
  borderAccent: string;
  softAccent: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
      className="flex justify-start"
    >
      <div
        className="max-w-[min(28rem,100%)] rounded-[1.35rem] rounded-bl-md border px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] sm:px-5"
        style={{
          borderColor: borderAccent,
          background: `linear-gradient(180deg, ${softAccent}, rgba(255,255,255,0.06))`,
        }}
      >
        <p className="text-xs text-white/42">{name} is typing</p>
        <div className="mt-2 flex items-center gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: accent }}
              animate={
                reducedMotion
                  ? { opacity: 0.8, y: 0, scale: 1 }
                  : {
                      opacity: [0.3, 1, 0.45],
                      y: [0, -2, 0],
                      scale: [0.92, 1.08, 1],
                    }
              }
              transition={
                reducedMotion
                  ? { duration: 0.12, ease: "easeOut" }
                  : {
                      duration: 0.9,
                      delay: dot * 0.12,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }
              }
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
