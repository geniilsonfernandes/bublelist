// src/store/onboardingStore.ts
import { zustandStorage } from "@/lib/storage";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type OnboardingStore = {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
};

const KEY = "onboarding";

export const useOnboardingStore = create(
  persist<OnboardingStore>(
    (set) => ({
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
    }),
    {
      name: KEY,
      storage: zustandStorage,
    }
  )
);
