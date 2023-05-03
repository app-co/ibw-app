import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SingIn } from "../pages/SingIn";
import { SingUp } from "../pages/SingUp";
import { Us } from "../pages/Us";
import { Eventos } from "../pages/Eventos";
import { Isncricao } from "../pages/Isncricao";
import { Steps } from "../pages/Steps";

const { Navigator, Screen } = createNativeStackNavigator();

export function SteckInscricao() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="incricao" component={Isncricao} />
      <Screen name="steps" component={Steps} />
    </Navigator>
  );
}
