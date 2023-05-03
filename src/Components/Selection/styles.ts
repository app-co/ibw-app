import styled, { css } from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../global/styles/theme";

type colors = "primary" | "secundary";

interface Props {
  select?: boolean;
  variant: colors;
}

export const Container = styled.TouchableOpacity`
  flex-direction: row;

  align-items: center;
  margin: 10px 0;
`;

export const title = styled.Text`
  margin-left: 10px;
  color: ${theme.colors.focus[1]};
  font-family: ${theme.fonts.Bold};
  font-size: ${RFValue(18)}px;
`;

export const box = styled.View<Props>`
  width: 20px;
  height: 20px;
  border-radius: 15px;

  ${(h) =>
    h.variant === "primary" &&
    css`
      border-color: ${theme.colors.focus[1]};
    `}

  ${(h) =>
    h.variant === "secundary" &&
    css`
      border-color: ${theme.colors.focus[1]};
    `}

  align-items: center;
  justify-content: center;
  border-width: 2px;
`;

export const circle = styled.View<Props>`
  ${(h) =>
    h.variant === "primary" &&
    css<Props>`
      background-color: ${(h) =>
        h.select ? theme.colors.focus[1] : theme.colors.secundary[1]};
    `}

  ${(h) =>
    h.variant === "secundary" &&
    css<Props>`
      background-color: ${(h) =>
        h.select ? theme.colors.focus[1] : theme.colors.primary[3]};
    `}

  width: 8px;
  height: 8px;
  border-radius: 5px;
`;
