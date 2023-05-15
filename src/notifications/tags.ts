import OneSignal from "react-native-onesignal";

export function tagsUserEmail(email: string) {
  OneSignal.sendTag("user_email", email);
}

export function tagsId(id: string) {
  OneSignal.setExternalUserId(id);
}
