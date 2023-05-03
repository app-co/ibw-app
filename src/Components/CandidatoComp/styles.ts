import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import theme from "../../global/styles/theme";

export const Container = styled.View`
  padding: 20px;

  border-width: 2px;
  border-color: ${theme.colors.secundary[1]};
  margin: 10px 0;
`;

export const title = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${theme.colors.text[2]};

  font-family: ${theme.fonts.Bold};
`;

export const sub = styled.Text`
  color: ${theme.colors.text[2]};
  font-family: ${theme.fonts.REGULAR};
  margin-left: 3px;
`;

export const bx = styled.View`
  flex-direction: row;

  align-items: center;
`;

export const row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

export const buttonA = styled.TouchableOpacity`
  border-radius: 5px;
  padding: 6px 15px;
  background-color: ${theme.colors.secundary[1]};
`;

export const buttonB = styled.TouchableOpacity`
  padding: 6px 15px;
  border-width: 1px;
  border-color: #af1616;
  background-color: #cf1e1e73;
  border-radius: 5px;
`;

export const textButton = styled.Text`
  color: ${theme.colors.text[2]};
  font-family: ${theme.fonts.REGULAR};
`;
