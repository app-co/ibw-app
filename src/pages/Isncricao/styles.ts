import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import theme from "../../global/styles/theme";

export const Container = styled.View`
  background-color: ${theme.colors.primary[3]};
  flex: 1;
`;

export const box = styled.View`
  padding: 20px;

  height: 80%;

  align-items: center;
  justify-content: center;
`;

export const title = styled.Text`
  font-size: ${RFValue(18)}px;

  text-align: center;
  margin-bottom: 10px;

  color: ${theme.colors.text[2]};
`;

export const text = styled.Text`
  margin-bottom: 50px;
  color: ${theme.colors.text[2]};
  margin-top: 20px;
`;

export const subTitle = styled.Text``;

export const grid = styled.View`
  flex-direction: row;
  align-self: flex-end;
  align-items: center;
`;
