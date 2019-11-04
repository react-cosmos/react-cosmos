import React from 'react';
import styled from 'styled-components';
import { Helmet } from './Helmet';
import { Planet } from './Planet';

export function Cosmosnaut() {
  return (
    <CosmosnautSvg viewBox="0 0 256 256">
      <Planet />
      <Helmet />
    </CosmosnautSvg>
  );
}

const CosmosnautSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
