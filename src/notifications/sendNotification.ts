import { ONE_SIGNAL_REST_API, ONE_SIGNAL_SDK_ID_ANDROID } from "@env";
import axios from "axios";
import OneSignal from "react-native-onesignal";

interface IProps {
  text: string;
  title: string;
  token: string[];
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
