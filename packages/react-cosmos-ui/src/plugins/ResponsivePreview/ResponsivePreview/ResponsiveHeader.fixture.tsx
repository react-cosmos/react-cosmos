import React from 'react';
import { useFixtureInput } from 'react-cosmos/client';
import { DEFAULT_DEVICES, DEFAULT_VIEWPORT_STATE } from '../shared.js';
import { ResponsiveHeader } from './ResponsiveHeader.js';
import { getViewportScaleFactor } from './style.js';

const initialViewport = DEFAULT_VIEWPORT_STATE.viewport;
const containerViewport = { width: 640, height: 480 };

export default () => {
  const [viewport, setViewport] = useFixtureInput('viewport', initialViewport);
  const [scaled, setScaled] = useFixtureInput('scaled', false);
  const scaleFactor = getViewportScaleFactor(viewport, containerViewport);
  return (
    <ResponsiveHeader
      devices={DEFAULT_DEVICES}
      selectedViewport={viewport}
      scaleFactor={scaleFactor}
      scaled={scaled}
      selectViewport={setViewport}
      toggleScale={() => setScaled(!scaled)}
    />
  );
};
