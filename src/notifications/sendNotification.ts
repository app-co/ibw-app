import { ONE_SIGNAL_REST_API, ONE_SIGNAL_SDK_ID_ANDROID } from "@env";
import axios from "axios";
import OneSignal from "react-native-onesignal";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

interface IProps {
  text: string;
  title: string;
  token: string;
}

export function sendPushNotification({ text, title, token }: IProps) {
  // const options = {
  //   method: "POST",
  //   url: "https://onesignal.com/api/v1/notifications",
  //   headers: {
  //     accept: "application/json",
  //     Authorization: ONE_SIGNAL_REST_API,
  //     "content-type": "application/json",
  //   },
  //   data: {
  //     app_id: ONE_SIGNAL_SDK_ID_ANDROID,
  //     incude_external_user_ids: token,
  //     headings: { en: title },
  //     contents: {
  //       en: text,
  //     },
  //     name: "INTERNAL_CAMPAIGN_NAME",
  //   },
  // };

  // axios
  //   .request(options)
  //   .then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.error(error.response.data);
  //   });

  const notificationObj = {
    contents: { en: text },
    headings: { en: title },
    include_player_ids: token,
  };
  const jsonString = JSON.stringify(notificationObj);
  OneSignal.postNotification(
    jsonString,
    (success) => {
      console.log("Success:", success);
    },
    (error) => {
      console.log("Error:", error);
    }
  );
}

export async function registerToken() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function sendExpoPushNotification({ text, title, token }: IProps) {
  const message = {
    to: token,
    sound: "default",
    title,
    body: text,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
