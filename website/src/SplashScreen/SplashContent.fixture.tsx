import React from 'react';
import { useValue } from 'react-cosmos-core/fixture';
import { useWindowViewport } from '../shared/useWindowViewport';
import { SplashContent } from './SplashContent';

export default () => {
  const windowViewport = useWindowViewport();
  const [stars] = useValue('stars', { defaultValue: 1337 });
  return <SplashContent windowViewport={windowViewport} gitHubStars={stars} />;
};
