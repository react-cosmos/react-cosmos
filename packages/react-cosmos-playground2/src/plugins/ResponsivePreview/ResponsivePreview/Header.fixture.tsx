import React from 'react';
import { DEFAULT_DEVICES } from '../shared';
import { Header } from './Header';
import { getViewportScaleFactor } from './style';

const { width, height } = DEFAULT_DEVICES[0];
const initialViewport = { width, height };
const containerViewport = { width: 640, height: 480 };

export default {
  stateless: (
    <Header
      devices={DEFAULT_DEVICES}
      selectedViewport={initialViewport}
      scaleFactor={0.75}
      scaled={false}
      selectViewport={viewport => console.log('Select viewport', viewport)}
      toggleScale={() => console.log('Toggle scale')}
    />
  ),

  stateful: function ViewportContainer() {
    const [viewport, setViewport] = React.useState(initialViewport);
    const [scaled, setScaled] = React.useState(false);
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
  }
};
