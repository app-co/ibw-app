import { Form } from "@unform/mobile";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import { Dimensions } from "react-native";
import theme from "../../global/styles/theme";

interface Category {
  select: boolean;
}

const h = Dimensions.get("screen").height;

export const box = styled.View`
  background-color: ${theme.colors.primary[3]};

  flex: 1;
`;

export const Container = styled.View`
  flex: 1;

  padding: 20px;
`;

export const title = styled.Text`
  color: ${theme.colors.text[2]};
  font-family: ${theme.fonts.Bold};
  margin-bottom: 30px;
  font-size: ${RFValue(18)}px;
  width: 70%;
  text-align: center;
`;

export const text = styled.Text`
  font-size: ${h * 0.018}px;
  text-align: center;
`;

export const form = styled(Form)`
  width: 100%;
`;

export const subText = styled.Text`
  color: ${theme.colors.text[2]};
  font-size: ${RFValue(16)}px;
  font-family: ${theme.fonts.REGULAR};
`;

export const boxRow = styled.View`
  width: 100%;
  flex-direction: row;
  margin: 10px 0;
  margin-bottom: 20px;
`;

export const flat = styled.FlatList`
  margin-top: 10px;
  margin-bottom: 30px;
`;

export const boxCategory = styled.TouchableOpacity<Category>`
  border-width: 1px;
  border-color: ${theme.colors.focus_second[1]};
  background-color: ${(h) =>
    h.select ? theme.colors.secundary[1] : theme.colors.primary[3]};
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 200px;
`;

export const boxImg = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 5px;

  align-items: center;
  justify-content: center;

  border-width: 2px;
  border-color: ${theme.colors.focus[1]};

  margin-top: 20px;
  margin-bottom: 30px;
`;

export const modal = styled.View`
  background-color: ${theme.colors.primary[3]};
  align-items: center;
  justify-content: center;
  align-self: center;
`;

export const boxSelect = styled.View`
  margin-bottom: 25px;
  align-items: center;
  margin: 20px 0;
  margin-bottom: 20px;
`;

export const closeModal = styled.TouchableOpacity`
  border-radius: 60px;

  align-self: flex-end;

  margin: 20px;
  position: relative;
`;

export const boxCancel = styled.View`
  padding: 20px;
  align-self: flex-end;
`;
