/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';


import { color } from '@/styles/color';
import { Feather } from '@expo/vector-icons';
import { HStack } from 'native-base';
import * as S from './styles';

interface IProps extends TouchableOpacityProps {
  title?: string;
  load?: boolean;
  styleType?: 'light' | 'dark' | 'border' | 'medium';
  bg_color?: string;
  txt_color?: string;
  icon?: string
}

export function Button({
  title = 'SALVAR',
  load,
  styleType = 'light',
  icon,
  ...rest
}: IProps) {
  return (
    <S.Container
      styleType={styleType}
      disabled={load}
      {...rest}
    >
      {load ? (
        <ActivityIndicator color={color.focus.ligh} size={36} />
      ) : (
        <HStack space={2} alignItems={'center'}>
          <Feather size={28} color={color.focus.regular} name={icon} />
          <S.title styleType={styleType}>
            {title}
          </S.title>
        </HStack>
      )}
    </S.Container>
  );
}
