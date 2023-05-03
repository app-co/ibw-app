import React from "react";
import { DrawerPosition, Image, Modal, TouchableOpacity } from "react-native";
import { Box, Center } from "native-base";
import Linear from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as S from "./styles";
import bg from "../../assets/bx.png";
import { IUserInc } from "../../dtos";
import theme from "../../global/styles/theme";
import logo from "../../assets/ico.png";

interface Props {
  data: IUserInc;
}

export function PassComp({ data }: Props) {
  const name = data.name.split(" ").map(String);
  const date = data.created_at.split(" - ").map(String);

  const [modal, setModal] = React.useState(false);

  return (
    <Box mt={5} bg={theme.colors.focus[1]}>
      <Modal animationType="fade" visible={modal} transparent>
        <Center mt={50} bg={theme.colors.focus[1]} padding="10">
          <S.subTitle>
            A verificação do atendimento dos requisitos de participação será
            realizada e em breve você será contactado pela equipe IBW. Obrigado!
          </S.subTitle>
          <TouchableOpacity
            onPress={() => setModal(false)}
            style={{
              padding: 5,
              marginTop: 10,
              borderWidth: 2,
              borderColor: theme.colors.secundary[1],
            }}
          >
            <S.subTitle>FECHAR</S.subTitle>
          </TouchableOpacity>
        </Center>
      </Modal>

      <S.bg source={bg} />
      <S.box>
        <S.Container>
          <S.contentImage>
            <S.boxImage>
              <Image
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
                source={{ uri: data?.photo }}
              />
            </S.boxImage>

            <S.subTitle>
              {name[0]} {name[2]}
            </S.subTitle>
          </S.contentImage>

          <S.content>
            <S.bxRow style={{ marginBottom: 10 }}>
              <S.title>Passaporte IBW 2023</S.title>
              {/* <Image source={logo} style={{ width: 60, height: 60 }} /> */}
              {/* <S.title>2023</S.title> */}
            </S.bxRow>
            <S.subTitle>Data de Inscrição: {date[0]}</S.subTitle>

            <S.bxRow>
              <S.subTitle>Status: </S.subTitle>
              <S.subTitle
                style={{
                  fontFamily: theme.fonts.Bold,
                  color:
                    data.status === "AUTORIZADO"
                      ? theme.colors.secundary[1]
                      : "#fa5b5b",
                }}
              >
                {data.status}{" "}
              </S.subTitle>

              {data?.status !== "AUTORIZADO" && (
                <TouchableOpacity
                  onPress={() => setModal(true)}
                  style={{ padding: 4 }}
                >
                  <Feather
                    name="alert-circle"
                    size={30}
                    color={theme.colors.secundary[1]}
                  />
                </TouchableOpacity>
              )}
            </S.bxRow>
          </S.content>
        </S.Container>

        <Box w="full" pr="10" />
      </S.box>

      <S.subTitle style={{}}>CATEGORIAS:</S.subTitle>

      {data?.category.map((h) => (
        <S.bxCategoria>
          <S.subTitle>{h.type}</S.subTitle>
        </S.bxCategoria>
      ))}
    </Box>
  );
}