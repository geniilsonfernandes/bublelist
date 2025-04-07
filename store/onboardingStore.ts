// src/store/onboardingStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type OnboardingStore = {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
  loadHasSeenOnboarding: () => Promise<void>;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  hasSeenOnboarding: false,

  setHasSeenOnboarding: async (value: boolean) => {
    set({ hasSeenOnboarding: value });
    await AsyncStorage.setItem("@hasSeenOnboarding", JSON.stringify(value));
  },

  loadHasSeenOnboarding: async () => {
    const stored = await AsyncStorage.getItem("@hasSeenOnboarding");
    if (stored !== null) {
      set({ hasSeenOnboarding: JSON.parse(stored) });
    }
  },
}));
