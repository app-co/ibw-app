import { ONE_SIGNAL_REST_API, ONE_SIGNAL_SDK_ID_ANDROID } from "@env";
import axios from "axios";
import { Box, Center, Text } from "native-base";
import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import OneSignal from "react-native-onesignal";
import {
  registerToken,
  sendExpoPushNotification,
} from "../../notifications/sendNotification";

export function Teste() {
  const [userId, setUserId] = React.useState("");
  const [token, setToken] = React.useState("seu token:");

  const message = `hello`;
  console.log(userId, "token");

  const push = React.useCallback(async () => {
    const token = await registerToken();
    console.log(token);
    sendExpoPushNotification({ title: "WELL COME", text: "BEM VINDO", token });
    setToken(token);
  }, []);

  return (
    <Center flex={1}>
      <Text fontSize="3xl">teste de envio de push</Text>
      <Text fontSize="sm">{token}</Text>

      <TouchableOpacity onPress={push}>
        <Text fontSize="4xl">enviar</Text>
      </TouchableOpacity>
    </Center>
  );
}
