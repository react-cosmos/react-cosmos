import React from 'react';
import styled from 'styled-components';
import { Body } from './Body';
import { Helmet } from './Helmet';
import { Planet } from './Planet';
import { Stars } from './Stars';

export function Cosmonaut() {
  return (
    <CosmonautSvg viewBox="0 0 256 256">
      <Planet />
      <Stars />
      <Body />
      <Helmet />
    </CosmonautSvg>
  );
}

const CosmonautSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
