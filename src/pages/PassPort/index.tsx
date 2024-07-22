import fire from "@react-native-firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Center, HStack, Image, VStack } from "native-base";
import React from "react";
import { IUserInc } from "../../dtos";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/AuthContext";
import * as S from "./styles";

export function PassPort() {
  const { user } = useAuth();

  const [response, setResponse] = React.useState<IUserInc[]>([]);
  React.useEffect(() => {
    fire()
      .collection("inscricao")
      .onSnapshot((h) => {
        const rs = h.docs.map((p) => {
          return {
            ...p.data(),
            id: p.id,
          } as IUserInc;
        });

        setResponse(rs);
      });
  }, []);

  const pass = React.useMemo(() => {
    return response
      .filter((h) => h.user_id === user?.id)
      .sort((a, b) => {
        if (a.created_at > b.created_at) {
          return -1;
        }

        return 1;
      });
  }, [response, user]);

  return (
    <S.Container>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={["#106975", "#3F1F82"]}
      >
        <HStack>
          <VStack p={4} h="600px" flex={1}>
            <HStack mt={8} alignItems="center" space={3}>
              <S.title>PASSPORT</S.title>
              <S.title style={{ fontFamily: theme.fonts.Bold, fontSize: 24 }}>
                ITA
              </S.title>
            </HStack>

            <HStack alignItems="center" space={8}>
              <Image mt={4} w={130} h={135} bg="gray.100" />
              <Center>
                <S.text>código</S.text>
                <S.codigo
                  style={{
                    color: theme.colors.secundary[1],
                    fontWeight: "700",
                  }}
                >
                  A0054
                </S.codigo>
              </Center>
            </HStack>

            <Box style={{ gap: 20 }}>
              <S.text
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  fontFamily: theme.fonts.Bold,
                }}
              >
                William Barbosa
              </S.text>

              <HStack mt={16}>
                <S.text style={{ color: theme.colors.secundary[1] }}>
                  Born -
                </S.text>
                <S.text>10/02/1989</S.text>
              </HStack>

              <HStack>
                <S.text style={{ color: theme.colors.secundary[1] }}>
                  Passport/Cpf -
                </S.text>
                <S.text>10/02/1989</S.text>
              </HStack>

              <HStack>
                <S.text style={{ color: theme.colors.secundary[1] }}>
                  Sexo -
                </S.text>
                <S.text>10/02/1989</S.text>
              </HStack>

              <HStack>
                <S.text style={{ color: theme.colors.secundary[1] }}>
                  Country -
                </S.text>
                <S.text>10/02/1989</S.text>
              </HStack>
            </Box>
          </VStack>

          <S.box>
            <S.ita>IINTERNATIONAL TAW IN ASSOCIATION</S.ita>
          </S.box>
        </HStack>
      </LinearGradient>
    </S.Container>
  );
}
