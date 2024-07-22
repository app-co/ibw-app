import LottieView from "lottie-react-native";
import { Image } from "native-base";
import React from "react";
import { Box, Container, Loti, Title } from "./styles";

import fundo from "../../assets/fundo-quem-somos.jpeg";
import loti from "../../assets/loti.json";

export function Us() {
  return (
    <Container>
      <Image
        top={-30}
        width="100%"
        height="310"
        resizeMode="contain"
        opacity={0.8}
        position="absolute"
        source={fundo}
        alt="fundo"
      />

      <Box style={{ marginTop: 30 }}>
        <Title>
          Surf de Ondas Grandes e Tow In em Itacoatirara, Ilha Mãe e Laje do
          Shock. Niterói - Brasil, desde 2018.
        </Title>

        <Loti>
          <LottieView autoPlay source={loti} />
        </Loti>
      </Box>
    </Container>
  );
}
