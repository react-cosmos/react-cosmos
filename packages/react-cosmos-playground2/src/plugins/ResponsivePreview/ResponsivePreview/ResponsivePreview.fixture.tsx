import React from 'react';
import { useValue } from 'react-cosmos/fixture';
import { DEFAULT_DEVICES } from '../shared';
import { ResponsivePreview } from './ResponsivePreview';

const { width, height } = DEFAULT_DEVICES[0];
const initialViewport = { width, height };

export default () => {
  const [viewport, setViewport] = useValue('viewport', {
    defaultValue: initialViewport,
  });
  const [scaled, setScaled] = useValue<boolean>('scaled', {
    defaultValue: false,
  });
  return (
    <ResponsivePreview
      devices={DEFAULT_DEVICES}
      enabled={true}
      viewport={viewport}
      scaled={scaled}
      validFixtureSelected={true}
      setViewport={setViewport}
      setScaled={setScaled}
    ></ResponsivePreview>
  );
};
