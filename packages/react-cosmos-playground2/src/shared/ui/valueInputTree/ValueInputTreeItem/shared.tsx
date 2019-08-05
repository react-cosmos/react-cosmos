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

export const UneditableInput = styled.span`
  box-sizing: border-box;
  height: 24px;
  padding: 2px 4px;
  line-height: 20px;
  color: var(--grey4);
  font-style: italic;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: not-allowed;
`;
