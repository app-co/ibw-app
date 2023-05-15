import { ONE_SIGNAL_REST_API, ONE_SIGNAL_SDK_ID_ANDROID } from "@env";
import axios from "axios";
import { Box, Center, Text } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import OneSignal from "react-native-onesignal";

export function Teste() {
  const [userId, setUserId] = React.useState("");

  async function getId() {
    await OneSignal.getDeviceState().then((h) => {
      const id = h?.userId ? h.userId : "";
      setUserId(id);
    });
  }

  const message = `hello`;
  console.log(userId, "token");

  const push = React.useCallback(async () => {
    getId();
  }, []);

  return (
    <Center flex={1}>
      <Text fontSize="3xl">teste de envio de push</Text>

      <TouchableOpacity onPress={push}>
        <Text fontSize="4xl">enviar</Text>
      </TouchableOpacity>
    </Center>
  );
}
