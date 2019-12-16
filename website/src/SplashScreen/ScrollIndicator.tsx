import React from 'react';
import styled from 'styled-components';
import { getCosmonautSize, Viewport } from './shared';

type Props = {
  windowViewport: Viewport;
};

// TODO: Scroll on click
export function ScrollIndicator({ windowViewport }: Props) {
  const cosmonautSize = getCosmonautSize(windowViewport);
  const bottom = 8 + Math.round(cosmonautSize / 32);
  const iconSize = 16 + Math.round(cosmonautSize / 16);
  return <ChevronsDownIcon size={iconSize} style={{ bottom }} />;
}

type ChevronsDownIconProps = {
  size: number;
  style?: {};
};

const ChevronsDownIcon = ({ size, style }: ChevronsDownIconProps) => (
  <StyledChevronsDownIcon
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="round"
    style={style}
  >
    <polyline points="7 13 12 18 17 13"></polyline>
    <polyline points="7 6 12 11 17 6"></polyline>
  </StyledChevronsDownIcon>
);

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
