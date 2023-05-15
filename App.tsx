/* eslint-disable camelcase */
/* eslint-disable react/style-prop-object */
import { StatusBar } from "expo-status-bar";
import Updates from "expo-updates";
import React, { useEffect } from "react";
import { AppState, LogBox, Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import * as WebBrowser from "expo-web-browser";
import {
  useFonts,
  Monda_400Regular,
  Monda_700Bold,
} from "@expo-google-fonts/monda";
import { NativeBaseProvider } from "native-base";
import * as Notifications from "expo-notifications";
import OneSignal from "react-native-onesignal";
import { ONE_SIGNAL_ID_IOS, ONE_SIGNAL_SDK_ID_ANDROID } from "@env";
import { Route } from "./src/routes";
import AppProvider from "./src/hooks";
import { ModalUpdate } from "./src/Components/ModalUpdate";
import { tagsUserEmail } from "./src/notifications/tags";

WebBrowser.maybeCompleteAuthSession();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const oneSignalId =
  Platform.OS === "ios" ? ONE_SIGNAL_ID_IOS : ONE_SIGNAL_SDK_ID_ANDROID;

OneSignal.setAppId(oneSignalId);

export default function App() {
  LogBox.ignoreLogs([`Setting a timer for a long period`]);

  const [showModalUpdate, setModalUpdates] = React.useState(false);

  // SERVICES MESSAGENS ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

  //* * UPDATE APLICATION ....................................................

  const ChecUpdadeDevice = React.useCallback(async () => {
    const { isAvailable } = await Updates.checkForUpdateAsync();
    if (isAvailable) {
      setModalUpdates(true);
    }
  }, []);

  const ReloadDevice = React.useCallback(async () => {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  }, []);

  React.useEffect(() => {
    AppState.addEventListener("change", (h) => {
      if (h === "active") {
        ChecUpdadeDevice();
      }
    });
  }, [ChecUpdadeDevice]);

  //* * .......................................................................

  const [fontsLoaded] = useFonts({
    Monda_400Regular,
    Monda_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <AppProvider>
        <NativeBaseProvider>
          <View style={{ flex: 1 }}>
            <ModalUpdate
              reload={ReloadDevice}
              latter={() => setModalUpdates(false)}
              visible={showModalUpdate}
            />
            <StatusBar hidden style="light" />
            <Route />
          </View>
        </NativeBaseProvider>
      </AppProvider>
    </NavigationContainer>
  );
}
