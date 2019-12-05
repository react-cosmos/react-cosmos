import React from 'react';
import { useWindowYScroll } from './useWindowYScroll';

const HEADER_SCROLL_STEP_PX = 4;

export function useHeaderScroll(windowHeight: number) {
  const yScroll = useWindowYScroll();
  const roundedYScroll = yScroll - (yScroll % HEADER_SCROLL_STEP_PX);
  return React.useMemo(() => {
    const scrollRatio = getScrollRatio(roundedYScroll, windowHeight);
    const cropRatio = Math.min(1, scrollRatio * 2);
    const minimizeRatio = Math.max(0, scrollRatio - 0.5) * 2;
    return { cropRatio, minimizeRatio };
  }, [roundedYScroll, windowHeight]);
}

function getScrollRatio(yScroll: number, windowHeight: number) {
  const threshold = windowHeight * 0.4;
  return Math.min(1, Math.max(0, yScroll / threshold));
}
