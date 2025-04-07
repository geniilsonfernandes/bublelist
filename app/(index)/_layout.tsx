import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AppIndexLayout() {
  //   const { user } = useUser();
  //   const networkState = useNetworkState();

  return (
    <Stack>
      <Stack.Screen name="list/new/index" />
    </Stack>
  );
}
