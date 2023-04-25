import React from 'react';
import styled from 'styled-components';
import { DelayedLoading } from '../../../components/DelayedLoading.js';
import { createGreyColor, grey144, grey192 } from '../../../style/colors.js';

export function WaitingForRenderer() {
  return (
    <DelayedLoading delay={500}>
      <Container>
        <Loader />
        <Message>Waiting for renderer...</Message>
      </Container>
    </DelayedLoading>
  );
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${createGreyColor(8, 0.85)};
  border-radius: 3px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Copied from https://codepen.io/bernethe/pen/dorozd
const Loader = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
  margin: 12px 0 24px 0;

  :before,
  :after {
    content: '';
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
    animation: spWaveBe 1.5s infinite linear;
  }

  :after {
    transform: scale(0, 0);
    opacity: 0;
    animation: spWaveAf 1.5s infinite linear;
  }

  @keyframes spWaveAf {
    from {
      transform: scale(0.5, 0.5);
      opacity: 0;
    }
    to {
      transform: scale(1, 1);
      opacity: 1;
    }
  }

  @keyframes spWaveBe {
    from {
      -webkit-transform: scale(1, 1);
      opacity: 1;
    }
    to {
      -webkit-transform: scale(1.5, 1.5);
      opacity: 0;
    }
  }
`;

const Message = styled.p`
  color: ${grey192};
  text-transform: uppercase;
  white-space: nowrap;
`;
