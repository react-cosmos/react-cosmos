import styled from 'styled-components';

export const Label = styled.label`
  flex-shrink: 0;
  display: block;
  max-width: 50%;
  box-sizing: border-box;
  padding: 0 6px 0 0;
  color: var(--grey4);
  font-size: 14px;
  user-select: none;
`;

export const InputContainer = styled.div`
  flex: auto;

  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
  }
`;
