import styled from 'styled-components';

export const Label = styled.label`
  padding: 0;
  color: var(--grey4);
  font-size: 14px;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ValueContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  min-width: 44px;
  min-height: 28px;
  box-sizing: border-box;
  padding: 2px;
  overflow: hidden;
`;

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
  color: var(--grey6);
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  outline: none;
  resize: none;
`;

export const TextMirror = styled.div`
  min-width: 32px;
  min-height: 20px;
  line-height: 20px;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UneditableInput = styled.span`
  height: 24px;
  padding: 0 4px;
  line-height: 24px;
  font-style: italic;
  white-space: pre;
  cursor: not-allowed;
`;
