import React from 'react';
import { DEFAULT_DEVICES } from '../shared';
import { Header } from './Header';

const { width, height } = DEFAULT_DEVICES[0];
const initialViewport = { width, height };

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
    return (
      <Header
        devices={DEFAULT_DEVICES}
        selectedViewport={viewport}
        scaleFactor={0.75}
        scaled={scaled}
        selectViewport={setViewport}
        toggleScale={() => setScaled(!scaled)}
      />
    );
  }
};
