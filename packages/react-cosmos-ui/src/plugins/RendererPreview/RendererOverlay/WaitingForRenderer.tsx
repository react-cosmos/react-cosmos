import React from 'react';
import styled from 'styled-components';
import {
  OverlayBody,
  RendererOverlayContainer,
  TextContainer,
} from '../../../components/ContentOverlay.js';
import { DelayedLoading } from '../../../components/DelayedLoading.js';

export function WaitingForRenderer() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => setCount(prev => prev + 1), 600);
    return () => clearInterval(interval);
  });

  const dots = Array((count % 3) + 1)
    .fill('.')
    .join('');
  return (
    <RendererOverlayContainer data-testid="waitingForRenderer">
      <OverlayBody>
        <TextContainer>
          <DelayedLoading delay={500}>
            <Message>Waiting for renderer{dots}</Message>
          </DelayedLoading>
        </TextContainer>
      </OverlayBody>
    </RendererOverlayContainer>
  );
}

const Message = styled.p`
  margin: 0 auto;
  width: 210px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
`;
