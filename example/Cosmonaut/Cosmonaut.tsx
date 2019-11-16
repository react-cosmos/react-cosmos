import React from 'react';
import styled from 'styled-components';
import { Body } from './Body';
import { Helmet } from './Helmet';
import { Planet } from './Planet';
import { Stars } from './Stars';

export function Cosmonaut() {
  return (
    <SvgContainer viewBox={`0 -256 512 512`}>
      <Sky />
      <Stars />
      <Planet />
      <Body />
      <Helmet />
    </SvgContainer>
  );
}

const SvgContainer = styled.svg`
  width: 100%;
  height: 100%;
`;

const Sky = styled.rect.attrs({
  x: 0,
  y: '-50%',
  width: '100%',
  height: '100%'
})`
  fill: #093556;
  /* clip-path: circle(128px at 128px 128px); */
`;
