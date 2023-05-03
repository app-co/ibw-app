import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import theme from "../../global/styles/theme";

export const Container = styled.View`
  background-color: ${theme.colors.primary[3]};
  flex: 1;
`;

export const title = styled.Text`
  font-family: ${theme.fonts.Bold};
  font-size: ${RFValue(16)}px;
  color: ${theme.colors.text[2]};
`;

export const subTitle = styled.Text``;

export const touch = styled.TouchableOpacity`
  background-color: #ffffff75;
  border-radius: 5px;
  padding: 3px 5px;
`;

export const link = styled.Text`
  color: ${theme.colors.focus[1]};
  font-weight: 900;
  /* font-family: ${theme.fonts.Bold}; */
`;
