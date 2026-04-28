"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Command, CornerDownLeft, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useFeedbackIntegrity } from "@/components/feedback/feedback-integrity";
import { commandDefinitions } from "@/data/commands";
import { cn } from "@/lib/utils";

import { useToast } from "@/components/ui/toast";

type CommandPaletteContextValue = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const listboxId = "command-palette-listbox";
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const { pushToast } = useToast();
  const { open: openFeedback } = useFeedbackIntegrity();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);

    window.setTimeout(() => {
      previouslyFocusedRef.current?.focus();
    }, 0);
  }, []);

  const open = useCallback(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
      return;
    }

    open();
  }, [close, isOpen, open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isOpenShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isOpenShortcut) {
        event.preventDefault();
        toggle();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return commandDefinitions;
    }

    return commandDefinitions.filter((command) => {
      const haystack = [
        command.title,
        command.subtitle,
        command.group,
        ...command.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query]);

  const groupedCommands = useMemo(() => {
    return filteredCommands.reduce<Record<string, typeof filteredCommands>>(
      (accumulator, command) => {
        accumulator[command.group] = accumulator[command.group] ?? [];
        accumulator[command.group].push(command);
        return accumulator;
      },
      {},
    );
  }, [filteredCommands]);

  const runCommand = useCallback(
    (commandId: string) => {
      const command = filteredCommands.find((item) => item.id === commandId);

      if (!command) {
        return;
      }

      if (command.toastTitle && command.toastBody) {
        pushToast({
          title: command.toastTitle,
          body: command.toastBody,
        });
      }

      if (command.action === "open-feedback") {
        close();
        window.setTimeout(() => {
          openFeedback();
        }, 0);
        return;
      }

      if (command.href && command.href !== pathname) {
        router.push(command.href);
      } else if (command.href && command.href === pathname) {
        router.replace(command.href);
      }

      close();
    },
    [close, filteredCommands, openFeedback, pathname, pushToast, router],
  );

  const flattenedIds = filteredCommands.map((command) => command.id);
  const safeActiveIndex =
    flattenedIds.length === 0 ? -1 : Math.min(activeIndex, flattenedIds.length - 1);
  const activeCommandId =
    safeActiveIndex >= 0 ? `command-option-${flattenedIds[safeActiveIndex]}` : undefined;

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        flattenedIds.length === 0 ? 0 : (current + 1) % flattenedIds.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        flattenedIds.length === 0
          ? 0
          : (current - 1 + flattenedIds.length) % flattenedIds.length,
      );
      return;
    }

    if (event.key === "Enter" && safeActiveIndex >= 0) {
      event.preventDefault();
      runCommand(flattenedIds[safeActiveIndex]);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (!focusable || focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const contextValue = useMemo(
    () => ({
      open,
      close,
      toggle,
    }),
    [close, open, toggle],
  );

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.16 }}
            className="fixed inset-0 z-[90] bg-black/55 px-4 py-6 backdrop-blur-md sm:px-6"
            onClick={close}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 12, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0.08 : 0.18, ease: "easeOut" }}
              className="mx-auto mt-[8vh] flex w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-white/10 bg-[linear-gradient(180deg,rgba(15,19,27,0.98),rgba(10,13,19,0.98))] shadow-[0_48px_120px_rgba(0,0,0,0.42)]"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={trapFocus}
            >
              <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
                <Search className="h-5 w-5 text-[color:var(--text-muted)]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder="Search workspace"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls={listboxId}
                  aria-activedescendant={activeCommandId}
                  aria-autocomplete="list"
                  className="w-full bg-transparent text-base text-white placeholder:text-[color:var(--text-muted)] focus:outline-none"
                />
                <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-black/20 px-2 py-1 font-mono text-xs text-white/80 sm:inline-flex">
                  <Command className="h-3 w-3" />
                  K
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-3">
                {filteredCommands.length === 0 ? (
                  <div className="rounded-[var(--radius-xl)] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center">
                    <p className="text-sm font-medium text-white">
                      No matching command. Probably not a real problem yet.
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                      Try broader terms like profile, logs, inbox, or philosophy.
                    </p>
                  </div>
                ) : (
                  <div
                    id={listboxId}
                    role="listbox"
                    aria-label="Workspace commands"
                    className="space-y-4"
                  >
                    {Object.entries(groupedCommands).map(([group, commands]) => (
                      <div key={group}>
                        <p className="px-3 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
                          {group}
                        </p>
                        <div className="grid gap-1">
                          {commands.map((command) => {
                            const index = flattenedIds.findIndex((id) => id === command.id);
                            const isActive = index === safeActiveIndex;

                            return (
                              <button
                                key={command.id}
                                type="button"
                                id={`command-option-${command.id}`}
                                role="option"
                                aria-selected={isActive}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => runCommand(command.id)}
                                className={cn(
                                  "flex items-center justify-between rounded-[var(--radius-xl)] border px-4 py-3 text-left transition duration-[var(--motion-fast)]",
                                  isActive
                                    ? "border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] text-white"
                                    : "border-transparent bg-transparent text-[color:var(--text-muted)] hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
                                )}
                              >
                                <div>
                                  <p className="text-sm font-medium text-inherit">
                                    {command.title}
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">
                                    {command.subtitle}
                                  </p>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/10 px-2 py-1 text-xs text-white/72">
                                  <CornerDownLeft className="h-3 w-3" />
                                  Run
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);

  if (!context) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }

  return context;
}
