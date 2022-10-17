import React from 'react';
import { useWindowViewport } from '../shared/useWindowViewport';
import { FullScreenCosmonaut } from './FullScreenCosmonaut';

export default () => {
  const windowViewport = useWindowViewport();
  return <FullScreenCosmonaut windowViewport={windowViewport} />;
};
