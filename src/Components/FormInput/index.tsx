/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextInputProps } from "react-native";
import { useField } from "@unform/core";

import * as S from "./styles";
import theme from "../../global/styles/theme";
import { _cpf, _date, cpf, date, texto } from "../../utils/mask";

interface Mask {
  type: "cpf" | "date" | "text" | "number";
}

interface Props extends TextInputProps {
  name: string;
  icon?: string;
  nome: string;
  mask?: Mask;
}

interface Reference {
  value: string;
}

export function Input({
  name,
  nome,
  mask = { type: "text" },
  icon,
  ...rest
}: Props) {
  const [isFocused, setsFocused] = useState(false);
  const [isFilled, setsFilled] = useState(false);
  const [text, setText] = useState("");
  const [msk, setMsk] = React.useState<Mask>(mask);

  const [mascara, setMascara] = React.useState("");

  const handleInput = useCallback(() => {
    setsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setsFocused(false);
    setsFilled(!!inpuValueRef.current.value);
  }, []);

  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = "", fieldName, error } = useField(name);
  const inpuValueRef = useRef<Reference>({ value: defaultValue });

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inpuValueRef.current,
      path: "value",
      setValue(ref: any, value) {
        inpuValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inpuValueRef.current.value = "";
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  React.useEffect(() => {
    switch (msk.type) {
      case "cpf":
        {
          const vl = _cpf(text);

          setMascara(vl);
        }
        break;

      case "date":
        {
          const vl = _date(text);

          setMascara(vl);
        }
        break;

      case "text":
        {
          const vl = texto(text);

          setMascara(vl);
        }
        break;

      default:
        break;
    }
  }, [msk.type, text]);

  return (
    <S.BoxContainer>
      <S.Title>{nome}</S.Title>
      <S.Box isFocus={isFocused} isError={!!error}>
        <S.Icon
          name={icon}
          size={20}
          color={
            isFocused || isFilled
              ? theme.colors.secundary[1]
              : theme.colors.text[3]
          }
        />
        <S.Container
          name={name}
          ref={inputElementRef}
          onFocus={handleInput}
          onBlur={handleBlur}
          defaultValue={defaultValue}
          onChangeText={(form) => {
            inpuValueRef.current.value = form;
            setText(form);
          }}
          value={mascara}
          {...rest}
        />
      </S.Box>
    </S.BoxContainer>
  );
}
