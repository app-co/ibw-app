/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { TextInputProps } from "react-native";

import { Entypo, Feather } from "@expo/vector-icons";

import { Box } from "native-base";

import theme from "../../../global/styles/theme";
import * as S from "./styles";

export interface TypeInput extends TextInputProps {
  icon?: React.ComponentProps<typeof Feather>["name"];
  label: string;
  error?: any;
  presIco?: () => void;
}

export function Input({
  value,
  presIco,
  error,
  label,
  icon,
  ...rest
}: TypeInput) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isFiled, setIsFiled] = React.useState(false);

  const handleFocus = React.useCallback(async () => {
    setIsFocused(true);
  }, []);

  const handleBlur = React.useCallback(async () => {
    setIsFocused(false);
    setIsFiled(!!value);
  }, [value]);

  return (
    <Box>
      {error ? (
        <S.title style={{ color: "#ff0000", fontFamily: theme.fonts.REGULAR }}>
          {error}
        </S.title>
      ) : (
        <S.title>{label}</S.title>
      )}
      <S.Container focus={isFocused} filed={isFiled} error={error}>
        <S.input
          value={value}
          onBlur={handleBlur}
          onFocus={handleFocus}
          cursorColor={theme.colors.focus[1]}
          {...rest}
        />

        {icon && (
          <S.boxIcon onPress={presIco}>
            <Entypo
              name={icon}
              size={20}
              color={
                isFiled || isFocused
                  ? theme.colors.primary[1]
                  : theme.colors.secundary[1]
              }
            />
          </S.boxIcon>
        )}
      </S.Container>
    </Box>
  );
}
