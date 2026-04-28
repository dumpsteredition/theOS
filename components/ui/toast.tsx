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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Toast = {
  id: number;
  title: string;
  body: string;
};

type ToastContextValue = {
  pushToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutMap = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const reducedMotion = useReducedMotion();

  const dismissToast = useCallback((id: number) => {
    const timeout = timeoutMap.current.get(id);

    if (timeout) {
      clearTimeout(timeout);
      timeoutMap.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ title, body }: Omit<Toast, "id">) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);

      setToasts((current) => [...current, { id, title, body }]);

      const timeout = setTimeout(() => dismissToast(id), 3200);
      timeoutMap.current.set(id, timeout);
    },
    [dismissToast],
  );

  useEffect(() => {
    const timeouts = timeoutMap.current;

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed left-1/2 top-[calc(env(safe-area-inset-top)+7rem)] z-[80] flex w-[min(24rem,calc(100vw-1.5rem))] -translate-x-1/2 flex-col gap-3 xl:top-[calc(env(safe-area-inset-top)+5.25rem)]"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.18, ease: "easeOut" }}
              className="pointer-events-auto rounded-[var(--radius-xl)] border border-[color:var(--accent-border)] bg-[linear-gradient(180deg,rgba(18,23,32,0.98),rgba(11,14,20,0.98))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] p-1.5 text-[color:var(--accent-strong)]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{toast.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">
                    {toast.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
