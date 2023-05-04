import { Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import Linear from "expo-linear-gradient";
import theme from "../../global/styles/theme";

const w = Dimensions.get("screen").width;

export const Container = styled.View`
  width: 100%;
  height: ${w * 0.4}px;

  flex-direction: row;
`;

export const box = styled.View`
`;

export const bg = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const title = styled.Text`
  font-size: ${RFValue(18)}px;

  color: ${theme.colors.text[2]};
  font-family: ${theme.fonts.Bold};
`;

export const subTitle = styled.Text`
  color: ${theme.colors.text[2]};

  font-family: ${theme.fonts.REGULAR};
`;

export const contentImage = styled.View`
  width: ${w * 0.3}px;
  height: ${w * 0.3}px;

  padding: 10px;
`;

export const bxCategoria = styled.View`
  border-width: 2px;
  border-color: ${theme.colors.secundary[1]};
  margin-bottom: 10px;
  padding: 2px 5px;
  width: ${w * 0.8};

`;

export const bxRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const content = styled.View`
  width: ${w * 0.7};
  padding-top: 10px;
`;

export const boxImage = styled.View`
  background-color: ${theme.colors.focus[1]};

  width: 100%;
  height: 100%;

  border-radius: 5px;
`;
