import styled from 'styled-components';
import { lightBlue } from '../../style/colors.js';

export const TextInputContainer = styled.div<{
  focused: boolean;
  focusedBg: string;
  focusedBoxShadow: string;
}>`
  box-sizing: border-box;
  max-width: 100%;
  padding: 2px 5px;
  border-radius: 3px;
  background: ${props => (props.focused ? props.focusedBg : 'transparent')};
  box-shadow: ${props => (props.focused ? props.focusedBoxShadow : 'none')};
`;

export const TextContainer = styled.div`
  position: relative;
`;

export const TextField = styled.textarea<{ focused: boolean; color: string }>`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: ${props => props.color};
  font-size: 14px;
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  outline: none;
  resize: none;
  opacity: ${props => (props.focused ? 1 : 0)};
`;

export const TextMirror = styled.div<{ focused: boolean; minWidth: number }>`
  color: ${lightBlue};
  opacity: ${props => (props.focused ? 0 : 1)};
  min-width: ${props => props.minWidth}px;
  min-height: 20px;
  font-size: 14px;
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
`;
