import React from 'react';
import { Viewport } from './shared';

export function useWindowViewport() {
  const [viewport, setViewport] = React.useState(getWindowViewport());
  React.useEffect(() => {
    function handleWindowResize() {
      const newViewport = getWindowViewport();
      if (didViewportChange(viewport, newViewport)) {
        setViewport(newViewport);
      }
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  });
  return viewport;
}

function getWindowViewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function didViewportChange(oldViewport: Viewport, newViewport: Viewport) {
  if (newViewport.width !== oldViewport.width) {
    return true;
  }
  // Ignore small height changes that occur on scroll in landscape mode.
  // Eg. Safari on iOS minimizes the address bar and hides the bottom menu
  // after initial scroll
  const heightDiff = Math.abs(newViewport.height - oldViewport.height);
  return heightDiff / newViewport.height >= 0.2;
}
