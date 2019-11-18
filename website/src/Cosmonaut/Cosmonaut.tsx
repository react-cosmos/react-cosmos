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
  const viewBox = minimizeRatio > 0 ? `0 0 256 256` : `0 -128 512 512`;
  const skyMaskRadius = minimizeRatio > 0 ? 128 : getSkyMaskRadius(cropRatio);
  return (
    <SvgContainer viewBox={viewBox}>
      <defs>
        <clipPath id="skyMask">
          <circle cx="128" cy="128" r={skyMaskRadius} />
        </clipPath>
      </defs>

      <Sky minimizeRatio={minimizeRatio} />
      <Stars />
      <Planet minimizeRatio={minimizeRatio} />
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
    return (
      <StyledSky
        x={0}
        y={0}
        width={256}
        height={256}
        clipPath="url(#skyMask)"
      />
    );
  }

  return (
    <StyledSky
      x={0}
      y={-256}
      width={512}
      height={768}
      clipPath="url(#skyMask)"
    />
  );
}

function getSkyMaskRadius(cropRatio: number) {
  return 128 + (640 - 128) * (1 - cropRatio);
}

const SvgContainer = styled.svg`
  width: 100%;
  height: 100%;
`;

const StyledSky = styled.rect`
  fill: #093556;
`;
