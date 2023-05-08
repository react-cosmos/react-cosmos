import React from 'react';
import styled from 'styled-components';
import { DelayedRender } from '../../../components/DelayedRender.js';
import { grey144 } from '../../../style/colors.js';
import {
  RendererOverlayContainer,
  RendererOverlayIconWrapper,
  RendererOverlayMessage,
} from './rendererOverlayShared.js';

export function WaitingForRenderer() {
  return (
    <DelayedRender delay={500}>
      <RendererOverlayContainer>
        <RendererOverlayIconWrapper>
          <Loader />
        </RendererOverlayIconWrapper>
        <RendererOverlayMessage>Waiting for renderer...</RendererOverlayMessage>
      </RendererOverlayContainer>
    </DelayedRender>
  );
}

// Copied from https://codepen.io/bernethe/pen/dorozd
const Loader = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  position: relative;

  :before,
  :after {
    content: '';
    box-sizing: border-box;
    border: 1px ${grey144} solid;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
  }

  :before {
    transform: scale(1, 1);
    opacity: 1;
    animation: waveOuter 1.5s infinite linear;
  }

  :after {
    transform: scale(0, 0);
    opacity: 0;
    animation: waveInner 1.5s infinite linear;
  }

  @keyframes waveOuter {
    from {
      -webkit-transform: scale(1, 1);
      opacity: 1;
    }
    to {
      -webkit-transform: scale(1.5, 1.5);
      opacity: 0;
    }
  }

  @keyframes waveInner {
    from {
      transform: scale(0.5, 0.5);
      opacity: 0;
    }
    to {
      transform: scale(1, 1);
      opacity: 1;
    }
  }
`;
