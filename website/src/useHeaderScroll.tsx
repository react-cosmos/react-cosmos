import { useWindowYScroll } from './useWindowYScroll';

export const HEADER_SCROLL_LENGTH_PX = 1024;
const HEADER_SCROLL_STEP_PX = 4;

export function useHeaderScroll() {
  const yScroll = useWindowYScroll();
  const roundedYScroll = yScroll - (yScroll % HEADER_SCROLL_STEP_PX);
  return getScrollRatio(roundedYScroll);
}

function getScrollRatio(yScroll: number) {
  return Math.min(1, Math.max(0, yScroll / HEADER_SCROLL_LENGTH_PX));
}
