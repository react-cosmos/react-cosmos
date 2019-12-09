import React from 'react';
import { FullScreenHeader } from './FullScreenHeader';
import { useWindowViewport } from './useWindowViewport';
import { useValue } from 'react-cosmos/fixture';

export default () => {
  const windowViewport = useWindowViewport();
  const [stars] = useValue('stars', { defaultValue: 1337 });
  return (
    <FullScreenHeader
      windowViewport={windowViewport}
      cropRatio={0}
      gitHubStars={stars}
    />
  );
};
