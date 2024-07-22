import fire from "@react-native-firebase/firestore";
import { Form } from "@unform/mobile";
import * as Link from "expo-linking";
import { Box, Center } from "native-base";
import React from "react";
import { FlatList } from "react-native";
import { CandidatoComp } from "../../Components/CandidatoComp";
import { Input } from "../../Components/FormInput";
import { IUserInc } from "../../dtos";
import {
  sendExpoPushNotification
} from "../../notifications/sendNotification";
import * as S from "./styles";

export function Candidatos() {
  const [response, setResponse] = React.useState<IUserInc[]>([]);
  const [search, setSearch] = React.useState("");

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

  const handleLinking = React.useCallback(async () => {
    Link.openURL("https://ibw-web.vercel.app");
  }, []);

  const list =
    search !== ""
      ? response.filter((h) => h.name.includes(search.toUpperCase()))
      : response;

  const candidatos = React.useMemo(() => {
    // 08/05/2023 - 16:01  "08/05/2023 - 16:2
    return list.sort((a, b) => {
      if (a.created_at > b.created_at) {
        return -1;
      }
      return 1;
    });
  }, [list]);

  const handleUpdate = React.useCallback(async (id: string, token: string) => {
    fire()
      .collection("inscricao")
      .doc(id)
      .update({
        status: "INSCRIÇÃO APROVADA",
      })
      .then(() => {
        const title = "IBW 2023 - INSCRIÇÃO APROVADA";
        const text = "Favor verificar seu passaporte no aplicativo";
        sendExpoPushNotification({ title, text, token });
      });
  }, []);

  const reprove = React.useCallback(async (id: string, token: string) => {
    fire()
      .collection("inscricao")
      .doc(id)
      .update({
        status: "INSCRIÇÃO REPROVADA",
      })
      .then(() => {
        const title = "IBW 2023 - INSCRIÇÃO REPROVADA";
        const text = "Requisitos de participação não verificados";
        sendExpoPushNotification({ title, text, token });
      });
  }, []);

  return (
    <S.Container>
      <Center>
        <S.title>Lista de Inscritos</S.title>
        <S.touch onPress={handleLinking}>
          <S.link>Baixar lista</S.link>
        </S.touch>
      </Center>

      <Box mt="5" px={10}>
        <Form>
          <Input
            onChangeText={setSearch}
            value={search}
            name="search"
            nome="Pesquisar por nome"
            icon="search"
          />
        </Form>
      </Box>

      <FlatList
        data={candidatos}
        keyExtractor={(h) => h.id}
        renderItem={({ item: h }) => (
          <CandidatoComp
            reprovar={() => reprove(h.id, h.token)}
            pres={() => handleUpdate(h.id, h.token)}
            item={h}
          />
        )}
      />
    </S.Container>
  );
}
