import { colors, emojiCategories } from "@/constants/list";
import { create } from "zustand";


type EmojiState = {
    emoji: string;
    background: string;
    setEmoji: (emoji: string) => void;
    setBackground: (background: string) => void;
};

export const useEmojiStore = create<EmojiState>((set) => ({
  emoji: emojiCategories[0].data[0],
  background: colors[0],
  setEmoji: (emoji: string) => set({ emoji }),
  setBackground: (background: string) => set({ background }),
}));

