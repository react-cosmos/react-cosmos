import React from 'react';
import { useValue } from 'react-cosmos/fixture';
import { SplashContent } from './SplashContent';
import { useWindowViewport } from './useWindowViewport';

export default () => {
  const windowViewport = useWindowViewport();
  const [stars] = useValue('stars', { defaultValue: 1337 });
  return <SplashContent windowViewport={windowViewport} gitHubStars={stars} />;
};
