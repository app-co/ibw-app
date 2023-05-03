import React from "react";
import { Text, Box, Center, VStack, HStack } from "native-base";
import { Dimensions, Modal } from "react-native";
import theme from "../../global/styles/theme";
import { ButtonLatter, ButtonUpdate } from "./styles";
import { UpdateDescription } from "../../utils";

interface Props {
  visible: boolean;
  reload: () => void;
  latter: () => void;
}

export function ModalUpdate({ visible, reload, latter }: Props) {
  const w = Dimensions.get("window").width;
  const h = Dimensions.get("window").height;

  return (
    <Modal visible={visible} transparent>
      <Box
        mt={h * 0.3}
        w={w * 0.8}
        borderRadius="10"
        // h={w * 0.4}
        bg={theme.colors.text[2]}
        alignSelf="center"
        alignItems="center"
        p={5}
      >
        <Center>
          <Text fontFamily={theme.fonts.Bold} fontSize={16}>
            Nova atualização disponível
          </Text>
        </Center>

        <Box mt={2}>
          {UpdateDescription.map((h) => (
            <Text>{h.title}</Text>
          ))}
        </Box>

        <HStack mt={5} space="5" justifyContent="space-between">
          <ButtonLatter onPress={latter}>
            <Text color={theme.colors.text[2]}>DEPOIS</Text>
          </ButtonLatter>

          <ButtonUpdate onPress={reload}>
            <Text color={theme.colors.text[2]}>ATUALIZAR</Text>
          </ButtonUpdate>
        </HStack>
      </Box>
    </Modal>
  );
}
