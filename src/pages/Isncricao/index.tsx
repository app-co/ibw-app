import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Buttom } from "../../Components/Buttom";
import * as S from "./styles";

export function Isncricao() {
  const { navigate } = useNavigation();
  const [load, setLoad] = React.useState(false);

  const handleSubmit = React.useCallback(async () => {
    navigate("steps");
  }, [navigate]);

  return (
    <S.Container>
      <S.box>
        <S.title>
          Bem vindo ao processo de solicitação de inscrição do ITA
        </S.title>

        <Buttom nome="CONTINUAR" load={load} pres={handleSubmit} />
      </S.box>
    </S.Container>
  );
}
