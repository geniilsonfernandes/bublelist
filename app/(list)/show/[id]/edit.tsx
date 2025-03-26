import ListCreateScreen from "@/screens/list/create";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ListCreateScreen />;
}
