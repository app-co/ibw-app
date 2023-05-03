import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import theme from "../../global/styles/theme";

const { colors, fonts } = theme;

export const ButtonLatter = styled.TouchableOpacity`
  width: ${RFValue(80)}px;
  height: ${RFValue(30)}px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.focus_second[1]};
`;

export const ButtonUpdate = styled.TouchableOpacity`
  width: ${RFValue(80)}px;
  height: ${RFValue(30)}px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.focus[1]};
`;

export const Title = styled.Text``;
