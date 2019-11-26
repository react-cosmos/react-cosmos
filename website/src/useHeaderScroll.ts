import React from 'react';

export const HEADER_SCROLL_LENGTH_PX = 512;
const HEADER_SCROLL_STEP_PX = 4;

export function useHeaderScroll(yScroll: number) {
  const roundedYScroll = yScroll - (yScroll % HEADER_SCROLL_STEP_PX);
  return React.useMemo(() => {
    const scrollRatio = getScrollRatio(roundedYScroll);
    const cropRatio = Math.min(1, scrollRatio * 2);
    const minimizeRatio = Math.max(0, scrollRatio - 0.5) * 2;
    return { cropRatio, minimizeRatio };
  }, [roundedYScroll]);
}

function getScrollRatio(yScroll: number) {
  return Math.min(1, Math.max(0, yScroll / HEADER_SCROLL_LENGTH_PX));
}
