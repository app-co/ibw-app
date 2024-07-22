import { TextInput } from "react-native";
import { css } from "styled-components";
import styled from "styled-components/native";
import theme from "../../../global/styles/theme";

interface I {
  filed: boolean;
  focus: boolean;
  error: boolean;
}

export type TCondition = "filed" | "focus" | "error";

export const Container = styled.View<I>`
  border-radius: 12px;
  flex-direction: row;
  width: 100%;
  height: ${45}px;
  align-items: center;

  border-width: 1px;
  border-color: #b9b7b7;

  ${(h: I) =>
    h.filed &&
    css`
      border-color: ${theme.colors.primary[1]};
      border-width: 1px;
    `}
  ${(h: I) =>
    h.focus &&
    css`
      border-color: ${theme.colors.primary[1]};
      border-width: 1px;
    `};

  ${(h: I) =>
    h.error &&
    css`
      border-color: #d62727;
      border-width: 1px;
    `};
`;

export const title = styled.Text`
  color: #dadada;
  font-family: ${theme.fonts.REGULAR};
  font-size: 12px;
  background-color: ${theme.colors.primary[3]};
  z-index: 30;
  padding: 0 5px;
`;

export const input = styled(TextInput)`
  flex: 1;
  padding: 0 0 0 10px;
  font-family: ${theme.fonts.REGULAR};
  color: ${theme.colors.text[2]};
`;

export const boxIcon = styled.TouchableOpacity`
  width: 40px;
  height: 100%;

  align-items: center;
  justify-content: center;
`;
