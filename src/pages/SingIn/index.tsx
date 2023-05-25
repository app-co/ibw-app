/* eslint-disable camelcase */
import { useNavigation } from "@react-navigation/native";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Modal, Platform, ScrollView } from "react-native";
import { Box, HStack, Image, Button, Text } from "native-base";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import Device from "expo-constants";
import auth from "@react-native-firebase/auth";
import { Buttom } from "../../Components/Buttom";
import { Input } from "../../Components/Input";
import { useAuth } from "../../hooks/AuthContext";
import * as S from "./styles";

import imageFundo from "../../assets/onda1.jpeg";
import fundo from "../../assets/logo-signIn.png";
import { LoginSocial } from "../../Components/LoginSocial";
import theme from "../../global/styles/theme";

interface PropsSignIn {
  email: string;
  senha: string;
}

export function SingIn() {
  const { navigate } = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const { signIn, loginSocial } = useAuth();

  const [email, setEmail] = React.useState("");

  const w = Dimensions.get("window").width;

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = React.useState(false);

  const device = React.useMemo(() => {
    if (Platform.OS === "ios") {
      const device = Device.platform.ios.buildNumber;
      return Number(device);
    }
  }, []);

  // ?? face .................................................................

  const handleSubmit = useCallback(
    (data: PropsSignIn) => {
      setLoading(true);

      setTimeout(() => {
        signIn({
          email: data.email,
          senha: data.senha,
        })
          .then(() => setLoading(false))
          .catch((err) => {
            // if (err.code === "auth/user-not-found") {
            //   Alert.alert("Erro na autenticação", "Usuaŕio nao encontrado");
            // }
          });
      }, 1500);
    },
    [signIn]
  );

  const handleForgotPass = React.useCallback(async () => {
    setLoading(true);
    auth()
      .sendPasswordResetEmail(email)
      .then((h) => {
        Alert.alert("Verefique seu email para recuperar sua senha");
        setLoading(false);
        setEmail("");
        setModal(false);
      })
      .catch((h) => {
        const { code } = h;
        if (code === "auth/user-not-found") {
          Alert.alert("Erro", "E-Mail não cadastrado");
          setLoading(false);
          setModal(false);
          setEmail("");
        } else {
          setEmail("");

          Alert.alert("Ocorreu um erro, tente novamente mais tarde");
          setLoading(false);
          setModal(false);
        }
      });
  }, [email]);

  return (
    <>
      <S.Container>
        <Modal visible={modal} transparent>
          <S.boxForgetPass>
            <Text color="#fff" mb={8}>
              Digite seu email para poder recuperar sua senha.
            </Text>

            <Form>
              <Input
                onChangeText={setEmail}
                nome="Digite seu E-Mail"
                name="email"
                value={email}
              />
            </Form>

            <Buttom load={loading} pres={handleForgotPass} nome="ENVIAR" />
          </S.boxForgetPass>
        </Modal>

        <S.ImageFundo resizeMode="contain" source={imageFundo} />

        <Box
          left="5"
          top={Platform.OS === "ios" ? w * 0.1 : 15}
          position="absolute"
        >
          <Image resizeMode="contain" alt="logo" source={fundo} size="110" />
        </Box>

        <ScrollView
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            alignItems: "center",
            marginTop: 100,
            height: 600,
          }}
        >
          <S.Title>LOGIN</S.Title>
          <S.BoxInput>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input
                nome="E-MAIL"
                type="custom"
                name="email"
                icon="user"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Input
                nome="SENHA"
                secureTextEntry
                type="cel-phone"
                name="senha"
                icon="lock"
              />
            </Form>

            <S.buttonForgetPass onPress={() => setModal(true)}>
              <S.Up>Esqueci minha senha</S.Up>
            </S.buttonForgetPass>
          </S.BoxInput>

          <Buttom
            load={loading}
            nome="ENTRAR"
            pres={() => formRef.current?.submitForm()}
          />
        </ScrollView>

        {/* <LoginSocial pres={() => prompAsync()} /> */}
      </S.Container>

      <S.CreateAccount>
        <S.BoxCreateAcc onPress={() => navigate("singUp")}>
          <S.IconAcc name="log-in" />
          <S.Up>CRIE UMA CONTA</S.Up>
        </S.BoxCreateAcc>
      </S.CreateAccount>
    </>
  );
}
