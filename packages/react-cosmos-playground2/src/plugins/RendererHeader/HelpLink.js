// @flow

import React from 'react';
import styled from 'styled-components';
import { HelpCircleIcon } from '../../shared/icons';

// TODO: Find common abstraction between this and shared/components/Button
export function HelpLink() {
  return (
    <StyledLink
      href="https://join-react-cosmos.now.sh"
      rel="noopener noreferrer"
      target="_blank"
    >
      <IconContainer>
        <HelpCircleIcon />
      </IconContainer>
      ask for help
    </StyledLink>
  );
}

const StyledLink = styled.a`
  --hover-bg: hsl(var(--hue-error), 87%, 95%);

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 8px;
  min-height: 32px;
  border-radius: 3px;
  color: var(--error2);
  text-decoration: none;
  transition: background var(--quick);

  :hover {
    background: var(--hover-bg);
  }
`;

const IconContainer = styled.span`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  padding: 2px 6px 0 0;
  color: var(--error3);
`;
