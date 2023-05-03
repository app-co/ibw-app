/* eslint-disable react/require-default-props */
import React from "react";
import * as S from "./styles";

type colors = "primary" | "secundary";

interface Props {
  text: string;
  select: boolean;
  pres: () => void;
  variant?: colors;
}

export function Selection({ text, pres, select, variant = "primary" }: Props) {
  return (
    <S.Container onPress={pres}>
      <S.box variant={variant}>
        <S.circle variant={variant} select={select} />
      </S.box>
      <S.title>{text}</S.title>
    </S.Container>
  );
}
