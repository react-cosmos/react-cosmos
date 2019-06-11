import styled from 'styled-components';

export const Label = styled.label`
  flex-shrink: 0;
  padding: 0 2px 0 0;
  color: var(--grey4);
  font-size: 14px;
  user-select: none;
`;

export const TextInputContainer = styled.div<{ focused: boolean }>`
  margin-top: 2px;
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
  color: var(--grey6);
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  outline: none;
  resize: none;
`;

export const TextMirror = styled.div`
  min-width: 32px;
  max-width: 192px;
  min-height: 20px;
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  opacity: 0;
`;
