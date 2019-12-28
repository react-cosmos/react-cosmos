import React from 'react';
import styled from 'styled-components';
import { scrollTo } from '../shared/scrollTo';
import { getCosmonautSize, Viewport } from '../shared/viewport';

type Props = {
  windowViewport: Viewport;
};

export function ScrollIndicator({ windowViewport }: Props) {
  const cosmonautSize = getCosmonautSize(windowViewport);
  const bottom = 8 + Math.round(cosmonautSize / 32);
  const iconSize = 16 + Math.round(cosmonautSize / 16);

  return (
    <StyledChevronsDownIcon
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="round"
      style={{ bottom }}
      onClick={scrollToContent}
    >
      <polyline points="7 13 12 18 17 13"></polyline>
      <polyline points="7 6 12 11 17 6"></polyline>
    </StyledChevronsDownIcon>
  );
}

function scrollToContent() {
  const content = document.getElementById('gradient1');
  if (content) scrollTo(content.offsetTop);
}

const StyledChevronsDownIcon = styled.svg`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  font-weight: 300;
  letter-spacing: 0.03em;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  animation: pulse 4s infinite ease-in-out;
  cursor: pointer;

  @keyframes pulse {
    0% {
      transform: translateY(-20%);
      opacity: 0.2;
    }
    50% {
      transform: translateY(0);
      opacity: 0.4;
    }
    100% {
      transform: translateY(-20%);
      opacity: 0.2;
    }
  }
`;
