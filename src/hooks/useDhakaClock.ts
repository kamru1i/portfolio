"use client";

import { useSyncExternalStore } from "react";

const DHAKA_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Dhaka",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatDhakaSnapshot(): string {
  try {
    return `${DHAKA_TIME_FORMATTER.format(new Date())} (GMT +6)`;
  } catch {
    return "7:00 PM (GMT +6)";
  }
}

let currentSnapshot = "";
let timerId: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function scheduleNextMinuteTick() {
  if (timerId !== null || listeners.size === 0) return;

  const msUntilNextMinute = 60_000 - (Date.now() % 60_000) + 50;
  timerId = setTimeout(() => {
    timerId = null;
    const next = formatDhakaSnapshot();
    if (next !== currentSnapshot) {
      currentSnapshot = next;
      listeners.forEach((listener) => listener());
    }
    scheduleNextMinuteTick();
  }, msUntilNextMinute);
}

function subscribeDhakaClock(listener: () => void): () => void {
  if (!currentSnapshot) {
    currentSnapshot = formatDhakaSnapshot();
  }
  listeners.add(listener);
  scheduleNextMinuteTick();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };
}

function getClientSnapshot(): string {
  if (!currentSnapshot) {
    currentSnapshot = formatDhakaSnapshot();
  }
  return currentSnapshot;
}

/**
 * Returns the live local time in Chittagong / Dhaka (UTC+6) formatted as `H:MM AM/PM (GMT +6)`.
 * Shares a single minute-aligned timer across all mounted subscribers instead of polling every second.
 */
export function useDhakaClock(serverFallback = "7:00 PM (GMT +6)"): string {
  return useSyncExternalStore(
    subscribeDhakaClock,
    getClientSnapshot,
    () => serverFallback
  );
}
