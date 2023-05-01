import React from 'react';
import { useValue } from 'react-cosmos-core/client.js';
import { useWindowViewport } from '../shared/useWindowViewport.js';
import { SplashContent } from './SplashContent.js';

export default () => {
  const windowViewport = useWindowViewport();
  const [stars] = useValue('stars', { defaultValue: 1337 });
  return <SplashContent windowViewport={windowViewport} gitHubStars={stars} />;
};
