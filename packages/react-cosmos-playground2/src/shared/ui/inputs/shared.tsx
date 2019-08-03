import styled from 'styled-components';

export const TextInputContainer = styled.div<{ focused: boolean }>`
  box-sizing: border-box;
  max-width: 100%;
  padding: 2px 4px;
  border-radius: 3px;
  background: ${props => (props.focused ? 'var(--grey1)' : 'transparent')};
  box-shadow: ${props =>
    props.focused ? '0 0 0.5px 1px var(--primary4)' : 'none'};
`;

export const TextContainer = styled.div`
  position: relative;
`;

export const TextField = styled.textarea`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: none;
  color: var(--grey7);
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  outline: none;
  resize: none;
`;

export const TextMirror = styled.div<{ focused: boolean; minWidth: number }>`
  opacity: ${props => (props.focused ? 0 : 1)};
  min-width: ${props => props.minWidth}px;
  min-height: 20px;
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
`;
