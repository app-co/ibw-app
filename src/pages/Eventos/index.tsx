import Firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { Box, Center, Image, Text } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { INewsDto } from "../../dtos";
import theme from "../../global/styles/theme";
import { sizeW } from "../../utils";
import { BoxImags, Container, Title } from "./styles";

const playList = [1, 2, 3, 4, 5];

export function Eventos() {
  const [news, setNews] = useState<INewsDto[]>([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    Firestore()
      .collection("news")
      .onSnapshot((h) => {
        const data = h.docs.map((p) => {
          return {
            id: p.id,
            ...p.data(),
          } as INewsDto;
        });

        setNews(data);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (news.length !== 0) {
        setLoad(false);
      } else {
        setTimeout(() => {
          setLoad(false);
        }, 1000);
      }
    }, [news])
  );

  return (
    <Container>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#868686 " }}>
        <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
          <Center>
            <Text
              fontSize="lg"
              fontFamily={theme.fonts.Bold}
              color={theme.colors.text[2]}
            >
              EDIÇOÕES ANTERIOERES
            </Text>
            <Text fontFamily={theme.fonts.REGULAR} color={theme.colors.text[2]}>
              (Previeus editions)
            </Text>
            {load ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                }}
              >
                <Title>AINDA NAO TEMOS UM EVENTO ROLANDO</Title>
                <ActivityIndicator size="large" color={theme.colors.text[2]} />
              </View>
            ) : (
              <Box mt={4} p={3}>
                <FlatList
                  contentContainerStyle={{ gap: 15, paddingHorizontal: 10 }}
                  horizontal
                  data={playList}
                  keyExtractor={(h) => String(h)}
                  renderItem={({ item: h }) => (
                    <Box>
                      <YoutubePlayer height={190} width={sizeW(0.9)} />
                    </Box>
                  )}
                />

                <Text
                  fontSize="lg"
                  fontFamily={theme.fonts.Bold}
                  color={theme.colors.text[2]}
                  mt={10}
                >
                  Destaques
                </Text>

                <FlatList
                  horizontal
                  contentContainerStyle={{ gap: 15, paddingHorizontal: 20 }}
                  nestedScrollEnabled
                  style={{
                    marginTop: 10,
                  }}
                  data={playList}
                  keyExtractor={(h) => h.id}
                  renderItem={({ item: h }) => (
                    <BoxImags>
                      <Image
                        rounded={6}
                        w={sizeW(0.9)}
                        alt="img"
                        h="200px"
                        bg="gray.300"
                      />
                    </BoxImags>
                  )}
                />

                <Text
                  fontSize="lg"
                  fontFamily={theme.fonts.Bold}
                  color={theme.colors.text[2]}
                  mt={10}
                >
                  Classificações
                </Text>

                <FlatList
                  horizontal
                  contentContainerStyle={{ gap: 15, paddingHorizontal: 20 }}
                  nestedScrollEnabled
                  style={{
                    marginTop: 10,
                  }}
                  data={playList}
                  keyExtractor={(h) => h.id}
                  renderItem={({ item: h }) => (
                    <BoxImags>
                      <Image
                        rounded={6}
                        w={sizeW(0.9)}
                        alt="img"
                        h="200px"
                        bg="gray.300"
                      />
                    </BoxImags>
                  )}
                />
              </Box>
            )}
          </Center>
        </ScrollView>
      </SafeAreaView>
    </Container>
  );
}
