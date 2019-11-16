import React from 'react';
import styled from 'styled-components';
import { Cosmonaut } from './Cosmonaut';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

export default () => {
  const { width, height } = useViewport();
  const size = Math.max(width, height);

  return (
    <Container style={{ width, height }}>
      <CosmonautContainer style={{ width: size, height: size }}>
        <Cosmonaut />
      </CosmonautContainer>
    </Container>
  );
};

function useViewport() {
  const [viewport, setViewport] = React.useState(getViewport());
  React.useEffect(() => {
    function handleWindowResize() {
      setViewport(getViewport());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  });
  return viewport;
}

function getViewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}
