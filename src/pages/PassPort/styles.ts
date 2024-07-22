import styled from "styled-components/native";
import theme from "../../global/styles/theme";

export const Container = styled.View`
  background-color: ${theme.colors.primary[3]};

  flex: 1;
`;

export const title = styled.Text`
  font-size: 20px;
  letter-spacing: 10px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.text[2]};
`;

export const codigo = styled.Text`
  font-size: 28px;
  letter-spacing: 5px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.text[2]};
`;

export const text = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.REGULAR};
  color: ${theme.colors.text[2]};
`;

export const box = styled.View`
  background-color: ${theme.colors.primary[1]};
  width: 50px;
  margin-right: 10px;
`;

export const ita = styled.Text`
  transform: rotate(90deg);
  color: ${theme.colors.text[2]};
  position: absolute;
  width: 600px;
  top: 310px;
  right: -276px;
  font-size: 24px;
  letter-spacing: 4px;
  /* flex: 1; */
`;
