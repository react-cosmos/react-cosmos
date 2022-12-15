import React from 'react';
import { useWindowViewport } from '../shared/useWindowViewport.js';
import { FullScreenCosmonaut } from './FullScreenCosmonaut.js';

export default () => {
  const windowViewport = useWindowViewport();
  return <FullScreenCosmonaut windowViewport={windowViewport} />;
};
