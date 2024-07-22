import { TouchableOpacity } from 'react-native';

import styled, { css } from 'styled-components/native';

import { color } from '@/styles/color';
import { _text, hightPercent } from '@/styles/sizes';

interface IStyle {
  styleType: 'light' | 'dark' | 'border' | 'medium';
}
export const Container = styled(TouchableOpacity) <IStyle>`
  width: 100%;
  height: ${hightPercent('5.4')}px;

  ${h =>
    h.styleType === 'light' &&
    css<IStyle>`
      background-color: ${color.buttonLigh.bg};
    `}

  ${h =>
    h.styleType === 'dark' &&
    css<IStyle>`
      background-color: ${color.buttonDark.bg};
    `}

    ${h =>
    h.styleType === 'medium' &&
    css<IStyle>`
      background-color: ${color.buttonMediun.bg};
    `}


    ${h =>
    h.styleType === 'border' &&
    css<IStyle>`
      border-width: 1.5px;
      border-color: ${color.focus.regular};
`}


  align-items: center;
  justify-content: center;
  border-radius: 15px;

  margin-top: 10px;
`;

export const title = styled.Text<IStyle>`
  font-size: ${_text - 1}px;
  font-family: 'semi_bold';

  ${h =>
    h.styleType === 'light' &&
    css`
      color: ${color.buttonLigh.text_color};
    `}

  ${h =>
    h.styleType === 'dark' &&
    css`
      color: ${color.buttonDark.text_color};
    `}
  ${h =>
    h.styleType === 'medium' &&
    css`
      color: ${color.buttonMediun.text_color};
    `}

    ${h =>
    h.styleType === 'border' &&
    css`
      color: ${color.buttonBorder.text_color};
    `}
`;
