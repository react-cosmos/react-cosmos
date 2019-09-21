import React from 'react';
import { useValue } from 'react-cosmos/fixture';
import { DEFAULT_DEVICES } from '../shared';
import { Header } from './Header';
import { getViewportScaleFactor } from './style';

const { width, height } = DEFAULT_DEVICES[0];
const initialViewport = { width, height };
const containerViewport = { width: 640, height: 480 };

export default () => {
  const [viewport, setViewport] = useValue('viewport', {
    defaultValue: initialViewport
  });
  const [scaled, setScaled] = useValue('scaled', { defaultValue: false });
  const scaleFactor = getViewportScaleFactor(viewport, containerViewport);
  return (
    <Header
      devices={DEFAULT_DEVICES}
      selectedViewport={viewport}
      scaleFactor={scaleFactor}
      scaled={scaled}
      selectViewport={setViewport}
      toggleScale={() => setScaled(!scaled)}
    />
  );
};
