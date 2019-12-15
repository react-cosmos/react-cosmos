import React from 'react';
import styled from 'styled-components';
import { Body } from './Body';
import { Helmet } from './Helmet';
import { Planet } from './Planet';
import { Stars } from './Stars';
import { Tube } from './Tube';

type Props = {
  cropRatio: number;
  minimizeRatio: number;
  width: number;
  height: number;
};

export function Cosmonaut({ cropRatio, minimizeRatio, width, height }: Props) {
  const viewBox = minimizeRatio > 0 ? `0 0 256 256` : `0 -640 768 768`;
  const skyMaskRadius = minimizeRatio > 0 ? 128 : getSkyMaskRadius(cropRatio);
  const offset = getSkyOffset(minimizeRatio);
  return (
    <SvgContainer viewBox={viewBox} style={{ width, height }}>
      <defs>
        <clipPath id="skyMask">
          <SkyMaskCircle cx="128" cy="128" r={skyMaskRadius} />
        </clipPath>
      </defs>

      <g clipPath="url(#skyMask)">
        <Sky minimizeRatio={minimizeRatio} />
        <Stars />
        <PlanetContainer transform={`translate(${offset.x}, ${offset.y})`}>
          <Planet />
        </PlanetContainer>
        <Tube />
      </g>
      <Body />
      <Helmet />
    </SvgContainer>
  );
}

type SkyProps = {
  minimizeRatio: number;
};

function Sky({ minimizeRatio }: SkyProps) {
  if (minimizeRatio > 0) {
    return <StyledSky x={0} y={0} width={256} height={256} />;
  }

  return <StyledSky x={0} y={-512} width={768} height={1024} />;
}

const MAX_SKY_RADIUS = Math.sqrt(2 * Math.pow(640, 2));

function getSkyMaskRadius(cropRatio: number) {
  return MAX_SKY_RADIUS - (MAX_SKY_RADIUS - 128) * cropRatio;
}

function getSkyOffset(minimizeRatio: number) {
  const inverseRatio = 1 - minimizeRatio;
  const x = -60 * inverseRatio;
  const y = -112 * inverseRatio;
  return { x, y };
}

const SvgContainer = styled.svg`
  display: block;
  will-change: width, height;
`;

const StyledSky = styled.rect`
  fill: #093556;
`;

const SkyMaskCircle = styled.circle`
  will-change: r;
`;

const PlanetContainer = styled.g`
  will-change: transform;
`;
