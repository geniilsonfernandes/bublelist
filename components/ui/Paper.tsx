import { ThemedView } from "./ThemedView";

export const Paper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemedView colorName="background.1" style={{ borderRadius: 16 }}>
      {children}
    </ThemedView>
  );
};
