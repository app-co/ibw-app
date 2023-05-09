import React from "react";
import fire from "@react-native-firebase/firestore";
import { FlatList } from "react-native";
import { PassComp } from "../../Components/PassComp";
import * as S from "./styles";
import { IUserInc } from "../../dtos";
import { useAuth } from "../../hooks/AuthContext";
import { Header } from "../../Components/Header";

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
      <Header icon="menu" />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 200,
        }}
        data={pass}
        keyExtractor={(h) => h.id}
        renderItem={({ item: h }) => (
          <S.box>
            <PassComp data={h} />
          </S.box>
        )}
      />
    </S.Container>
  );
}
