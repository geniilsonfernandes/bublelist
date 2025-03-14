import { ActionButton } from "@/components/ui/ActionButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

export default function Onboarding() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background.1");
  return (
    <ThemedView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 100,
        justifyContent: "space-between",
        paddingBottom: 32,
      }}
    >
      <ActionButton variant="outline" style={{ alignSelf: "flex-end" }}>
        <Icon name="x" size={24} />
      </ActionButton>
      <View>
        <View style={{ marginVertical: 16, maxWidth: 300 }}>
          <ThemedText type="title.2" style={{ marginBottom: 8 }}>
            Orgamize suas listas de compras e facilite suas tarefas
          </ThemedText>

          <ThemedText
            type="body"
            style={{ marginBottom: 8 }}
            colorName="text.4"
          >
            Organize suas listas de compras e facilite suas tarefas
          </ThemedText>
        </View>
        <ThemedView
          style={{
            marginBottom: 16,
            backgroundColor: backgroundColor + "70",
            height: 300,
            borderRadius: 24,
            marginVertical: 16,
            paddingVertical: 48,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/images/feature-input.png")}
            style={{
              width: 250,
              height: 154.4,
              borderRadius: 18,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 16,
              gap: 8,
            }}
          >
            <ThemedView
              backgroundColor="background.8"
              style={{
                width: 16,
                height: 8,
                borderRadius: 4,
              }}
            />
            <ThemedView
              backgroundColor="background.8"
              style={{
                width: 8,
                height: 8,
                opacity: 0.5,
                borderRadius: 4,
              }}
            />
            <ThemedView
              backgroundColor="background.8"
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                opacity: 0.5,
              }}
            />
          </View>
        </ThemedView>
      </View>
      <Button
        onPress={() => {
          router.push("/(main)");
        }}
      >
        Começar
      </Button>
    </ThemedView>
  );
}
