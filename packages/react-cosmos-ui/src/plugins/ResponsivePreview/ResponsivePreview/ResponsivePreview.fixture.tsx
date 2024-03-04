import React from 'react';
import { useFixtureInput } from 'react-cosmos-renderer/client.js';
import styled from 'styled-components';
import { DEFAULT_DEVICES, DEFAULT_VIEWPORT_STATE } from '../shared.js';
import { ResponsivePreview } from './ResponsivePreview.js';

const initialViewport = DEFAULT_VIEWPORT_STATE.viewport;

export default () => {
  const [viewport, setViewport] = useFixtureInput('viewport', initialViewport);
  const [scaled, setScaled] = useFixtureInput('scaled', false);
  return (
    <Container>
      <ResponsivePreview
        devices={DEFAULT_DEVICES}
        enabled={true}
        viewport={viewport}
        scaled={scaled}
        setViewport={setViewport}
        setScaled={setScaled}
      />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
`;
