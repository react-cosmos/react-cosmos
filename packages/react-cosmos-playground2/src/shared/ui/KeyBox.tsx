import React from 'react';
import styled from 'styled-components';

type Props = {
  value: string;
  textColor: string;
  bgColor: string;
  size?: number;
  fontSize?: number;
};

// https://stackoverflow.com/a/11752084/128816
const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

const padding = 5;

export function KeyBox({
  value,
  textColor,
  bgColor,
  size = 24,
  fontSize = 14,
}: Props) {
  const displayValue = value === '⌘' && !isMacLike ? 'Ctrl' : value;
  return (
    <Container
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minWidth: size - 2 * padding,
        height: size,
        padding: `0 ${padding}px`,
        fontSize,
        lineHeight: `${size}px`,
      }}
    >
      {displayValue}
    </Container>
  );
}

const Container = styled.span`
  margin: 0 0 0 5px;
  padding: 0 ${padding}px;
  border-radius: 5px;
  text-align: center;

  :first-child {
    margin-left: 0;
  }
`;
