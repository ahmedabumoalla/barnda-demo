"use client";

import { useEffect, useState } from "react";
import { loyaltyDashboardDemoState } from "@/lib/loyalty/demo-data";
import type { LoyaltyDashboardDemoState } from "@/lib/loyalty/types";

export const LOYALTY_CARD_DESIGN_STORAGE_KEY = "barndaksa-loyalty-card-design";
const LEGACY_STORAGE_KEY = "barndaksa-demo-loyalty-config";
const LOYALTY_STATE_EVENT = "barndaksa-demo-loyalty-state";
const OLD_DEFAULT_CARD_COLORS = {
  cardBackground: "#4A281D",
  cardForeground: "#FCF8F3",
  cardAccent: "#D9A33F",
};

function withDefaults(value: Partial<LoyaltyDashboardDemoState> | null): LoyaltyDashboardDemoState {
  const state = {
    card: {
      ...loyaltyDashboardDemoState.card,
      ...(value?.card ?? {}),
    },
    points: {
      ...loyaltyDashboardDemoState.points,
      ...(value?.points ?? {}),
    },
  };

  const usesOldDefaultColors =
    state.card.cardBackground === OLD_DEFAULT_CARD_COLORS.cardBackground &&
    state.card.cardForeground === OLD_DEFAULT_CARD_COLORS.cardForeground &&
    state.card.cardAccent === OLD_DEFAULT_CARD_COLORS.cardAccent;

  if (usesOldDefaultColors) {
    state.card.cardBackground = loyaltyDashboardDemoState.card.cardBackground;
    state.card.cardForeground = loyaltyDashboardDemoState.card.cardForeground;
    state.card.cardAccent = loyaltyDashboardDemoState.card.cardAccent;
  }

  return state;
}

function readStoredState() {
  if (typeof window === "undefined") return loyaltyDashboardDemoState;
  try {
    const stableRaw = window.localStorage.getItem(LOYALTY_CARD_DESIGN_STORAGE_KEY);
    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const raw = stableRaw ?? legacyRaw;
    if (!raw) return loyaltyDashboardDemoState;
    const state = withDefaults(JSON.parse(raw) as Partial<LoyaltyDashboardDemoState>);
    if (!stableRaw && legacyRaw) {
      window.localStorage.setItem(LOYALTY_CARD_DESIGN_STORAGE_KEY, JSON.stringify(state));
    }
    return state;
  } catch {
    return loyaltyDashboardDemoState;
  }
}

export function saveLoyaltyDemoState(next: LoyaltyDashboardDemoState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOYALTY_CARD_DESIGN_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(LOYALTY_STATE_EVENT, { detail: next }));
}

export function useLoyaltyDemoState() {
  const [state, setState] = useState<LoyaltyDashboardDemoState>(loyaltyDashboardDemoState);

  useEffect(() => {
    setState(readStoredState());

    function handleStorage(event: StorageEvent) {
      if (event.key === LOYALTY_CARD_DESIGN_STORAGE_KEY || event.key === LEGACY_STORAGE_KEY) {
        setState(readStoredState());
      }
    }

    function handleLocal(event: Event) {
      const detail = (event as CustomEvent<LoyaltyDashboardDemoState>).detail;
      setState(withDefaults(detail));
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(LOYALTY_STATE_EVENT, handleLocal);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LOYALTY_STATE_EVENT, handleLocal);
    };
  }, []);

  function updateState(next: LoyaltyDashboardDemoState) {
    setState(next);
    saveLoyaltyDemoState(next);
  }

  return [state, updateState] as const;
}
