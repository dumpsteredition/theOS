"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  pickFeedbackPrankMode,
  type FeedbackPrankMode,
} from "@/components/feedback/feedback-pranks";
import { FeedbackModal } from "@/components/feedback/feedback-modal";

type FeedbackIntegrityContextValue = {
  open: () => void;
  close: () => void;
};

const FeedbackIntegrityContext =
  createContext<FeedbackIntegrityContextValue | null>(null);

export function FeedbackIntegrityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<FeedbackPrankMode | null>(null);
  const [lastMode, setLastMode] = useState<FeedbackPrankMode | null>(null);
  const [sessionId, setSessionId] = useState(0);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    const nextMode = pickFeedbackPrankMode(lastMode);
    setActiveMode(nextMode);
    setLastMode(nextMode);
    setSessionId((current) => current + 1);
    setIsOpen(true);
  }, [lastMode]);

  const value = useMemo(
    () => ({
      open,
      close,
    }),
    [close, open],
  );

  return (
    <FeedbackIntegrityContext.Provider value={value}>
      {children}
      <FeedbackModal
        key={sessionId}
        activeMode={activeMode}
        isOpen={isOpen}
        onClose={close}
      />
    </FeedbackIntegrityContext.Provider>
  );
}

export function useFeedbackIntegrity() {
  const context = useContext(FeedbackIntegrityContext);

  if (!context) {
    throw new Error(
      "useFeedbackIntegrity must be used within FeedbackIntegrityProvider",
    );
  }

  return context;
}
