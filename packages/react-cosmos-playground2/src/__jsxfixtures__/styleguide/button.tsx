import * as React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  --size: 36px;
  height: var(--size);
  padding: 0 16px;
  border: 0;
  background: var(--primary4);
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  line-height: var(--size);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;

  :focus {
    outline: none;
  }
`;

export default <StyledButton>Get started</StyledButton>;
