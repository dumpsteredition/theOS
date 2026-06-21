'use client';
import { useSyncExternalStore } from 'react';

// Hydration-safe clock hook - returns null during SSR, Date on client
// Caches the snapshot to avoid infinite loops with useSyncExternalStore

let cachedDate: Date | null = null;
let cachedTimestamp = 0;

function getSnapshot(): Date | null {
  const now = Date.now();
  // Only create a new Date object every second
  if (now - cachedTimestamp >= 1000 || cachedDate === null) {
    cachedDate = new Date();
    cachedTimestamp = now;
  }
  return cachedDate;
}

const getServerSnapshot = (): null => null;

function subscribe(callback: () => void): () => void {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
}

export function useClock(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
