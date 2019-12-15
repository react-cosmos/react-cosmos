import React from 'react';
import { useWindowYScroll } from './useWindowYScroll';

export function useHeaderScroll(windowHeight: number) {
  const yScroll = useWindowYScroll();
  return React.useMemo(() => {
    const scrollRatio = getScrollRatio(yScroll, windowHeight);
    const cropRatio = Math.min(1, scrollRatio * 2);
    const minimizeRatio = Math.max(0, scrollRatio - 0.5) * 2;
    return { cropRatio, minimizeRatio };
  }, [yScroll, windowHeight]);
}

function getScrollRatio(yScroll: number, windowHeight: number) {
  const threshold = windowHeight * 0.4;
  return Math.min(1, Math.max(0, yScroll / threshold));
}
