"use client";

import { useEffect, useState } from "react";
import { loyaltyDashboardDemoState } from "@/lib/loyalty/demo-data";
import type { LoyaltyDashboardDemoState } from "@/lib/loyalty/types";

const STORAGE_KEY = "barndaksa-demo-loyalty-config";

function withDefaults(value: Partial<LoyaltyDashboardDemoState> | null): LoyaltyDashboardDemoState {
  return {
    card: {
      ...loyaltyDashboardDemoState.card,
      ...(value?.card ?? {}),
    },
    points: {
      ...loyaltyDashboardDemoState.points,
      ...(value?.points ?? {}),
    },
  };
}

function readStoredState() {
  if (typeof window === "undefined") return loyaltyDashboardDemoState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return loyaltyDashboardDemoState;
    return withDefaults(JSON.parse(raw) as Partial<LoyaltyDashboardDemoState>);
  } catch {
    return loyaltyDashboardDemoState;
  }
}

export function saveLoyaltyDemoState(next: LoyaltyDashboardDemoState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("barndaksa-demo-loyalty-state", { detail: next }));
}

export function useLoyaltyDemoState() {
  const [state, setState] = useState<LoyaltyDashboardDemoState>(loyaltyDashboardDemoState);

  useEffect(() => {
    setState(readStoredState());

    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setState(readStoredState());
    }

    function handleLocal(event: Event) {
      const detail = (event as CustomEvent<LoyaltyDashboardDemoState>).detail;
      setState(withDefaults(detail));
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("barndaksa-demo-loyalty-state", handleLocal);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("barndaksa-demo-loyalty-state", handleLocal);
    };
  }, []);

  function updateState(next: LoyaltyDashboardDemoState) {
    setState(next);
    saveLoyaltyDemoState(next);
  }

  return [state, updateState] as const;
}
