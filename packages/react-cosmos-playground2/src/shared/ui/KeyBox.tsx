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

export function KeyBox({
  value,
  textColor,
  bgColor,
  size = 24,
  fontSize = 14,
}: Props) {
  const displayValue = value === '⌘' && !isMacLike ? 'Ctrl' : value;
  const padding = Math.floor(size / 4);
  const minWidth = size - 2 * padding;
  return (
    <Container
      style={{
        backgroundColor: bgColor,
        color: textColor,
        marginLeft: Math.round(size / 5),
        minWidth,
        height: size,
        padding: `0 ${padding}px`,
        borderRadius: Math.round(size / 5),
        fontSize,
        lineHeight: `${size}px`,
      }}
    >
      {displayValue}
    </Container>
  );
}

const Container = styled.span`
  text-align: center;

  :first-child {
    margin-left: 0 !important;
  }
`;
