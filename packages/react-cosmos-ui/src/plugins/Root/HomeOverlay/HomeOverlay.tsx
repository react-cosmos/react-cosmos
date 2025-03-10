import React from 'react';
import styled from 'styled-components';
import { grey8, white3 } from '../../../style/colors.js';

type Props = {};

export function HomeOverlay({}: Props) {
  return <Container />;
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${grey8};
  /* Black checkerboard effect on background */
  background-image: linear-gradient(
      45deg,
      ${white3} 25%,
      transparent 25%,
      transparent 75%,
      ${white3} 75%,
      ${white3} 100%
    ),
    linear-gradient(
      45deg,
      ${white3} 25%,
      transparent 25%,
      transparent 75%,
      ${white3} 75%,
      ${white3} 100%
    );
  background-size: 32px 32px;
  background-position:
    0 0,
    16px 16px;
`;
