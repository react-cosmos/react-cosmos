import React from 'react';
import styled from 'styled-components';
import { CheckCircleIcon } from '../../../components/icons/index.js';
import { grey144 } from '../../../style/colors.js';
import {
  RendererOverlayContainer,
  RendererOverlayIconWrapper,
  RendererOverlayMessage,
} from './rendererOverlayShared.js';

export function RemoteRendererConnected() {
  return (
    <RendererOverlayContainer>
      <RendererOverlayIconWrapper>
        <IconContainer>{<CheckCircleIcon strokeWidth={0.55} />}</IconContainer>
      </RendererOverlayIconWrapper>
      <RendererOverlayMessage>Remote renderer connected</RendererOverlayMessage>
    </RendererOverlayContainer>
  );
}

const svgRingRatio = 26.667 / 32;
const ringSize = 34;
const iconSize = ringSize / svgRingRatio;

const IconContainer = styled.span`
  width: ${iconSize}px;
  height: ${iconSize}px;
  color: ${grey144};
`;
