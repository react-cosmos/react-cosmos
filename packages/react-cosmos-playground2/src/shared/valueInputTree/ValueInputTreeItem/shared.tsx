import styled from 'styled-components';
import { grey128, grey224, disabledColors } from '../../colors';

export const Label = styled.label<{ disabled?: boolean }>`
  padding: 0;
  color: ${disabledColors(grey224, grey128)};
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
  padding: 2px 2px 2px 3px;
  overflow: hidden;
`;

export const UneditableInput = styled.span`
  box-sizing: border-box;
  height: 24px;
  padding: 2px 4px;
  line-height: 20px;
  color: ${grey128};
  font-style: italic;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: not-allowed;
`;
