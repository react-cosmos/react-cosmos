import React from 'react';
import styled from 'styled-components';
import { Body } from './Body';
import { Helmet } from './Helmet';
import { Planet } from './Planet';
import { Stars } from './Stars';

type Props = {
  cropRatio: number;
  minimizeRatio: number;
};

export function Cosmonaut({ cropRatio, minimizeRatio }: Props) {
  const viewBox = minimizeRatio > 0 ? `0 0 256 256` : `0 -256 512 512`;
  return (
    <SvgContainer viewBox={viewBox}>
      <Sky cropRatio={cropRatio} minimizeRatio={minimizeRatio} />
      <Stars />
      <Planet cropRatio={cropRatio} minimizeRatio={minimizeRatio} />
      <Body minimizeRatio={minimizeRatio} />
      <Helmet />
    </SvgContainer>
  );
}

type SkyProps = {
  cropRatio: number;
  minimizeRatio: number;
};

function Sky({ cropRatio, minimizeRatio }: SkyProps) {
  if (minimizeRatio > 0) {
    return (
      <StyledSky
        x={0}
        y={0}
        width={256}
        height={256}
        clipPath="circle(128px at 128px 128px)"
      />
    );
  }

  const radius = 512 - 384 * cropRatio;
  const y = 384 - 128 * minimizeRatio;
  return (
    <StyledSky
      x={0}
      y={-256}
      width={512}
      height={512}
      clipPath={`circle(${radius} at 128px ${y})`}
    />
  );
}

const SvgContainer = styled.svg`
  width: 100%;
  height: 100%;
`;

const StyledSky = styled.rect`
  fill: #093556;
`;
