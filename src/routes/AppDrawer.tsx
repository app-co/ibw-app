import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { DrawerContent } from "../Components/Drawer";
import { Header } from "../Components/Header";
import theme from "../global/styles/theme";
import { useAuth } from "../hooks/AuthContext";
import { News } from "../pages/AMD/News";
import { Candidatos } from "../pages/Candidatos";
import { Eventos } from "../pages/Eventos";
import { Home } from "../pages/Home";
import { PassPort } from "../pages/PassPort";
import { Us } from "../pages/Us";
import { SteckInscricao } from "./StackIncricao";

const Drawer = createDrawerNavigator();

export function AppDrawer() {
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        header: (props) => <Header {...props} icon="menu" />,
        drawerLabelStyle: { fontFamily: theme.fonts.REGULAR },
        // headerShown: false,
        drawerActiveTintColor: theme.colors.text[2],
        drawerInactiveTintColor: theme.colors.text[4],
      }}
      initialRouteName="home"
    >
      <Drawer.Screen options={{}} name="HOME" component={Home} />
      <Drawer.Screen name="EDIÇOES ANTERIORES" component={Eventos} />
      <Drawer.Screen name="ÁREA DO ATLETA" component={SteckInscricao} />
      <Drawer.Screen name="PASSPORT" component={PassPort} />
      <Drawer.Screen name="CANAL YOUTUBE" component={PassPort} />
      <Drawer.Screen name="QUEM SOMOS" component={Us} />
      {/* <Drawer.Screen name="INSCRIÇÃO NO IBW" component={SteckInscricao} /> */}
      {user?.adm && <Drawer.Screen name="ADICIONAR EVENTO" component={News} />}

      {user?.adm && <Drawer.Screen name="INSCRIÇÕES" component={Candidatos} />}
    </Drawer.Navigator>
  );
}
