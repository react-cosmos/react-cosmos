const slideInYOffset = 40;
const slideInOpacityDuration = 0.8;
const slideInYDuration = 1.2;

export const slideInDelay = 0.2;
export const slideInTransition = `${slideInOpacityDuration}s opacity, ${slideInYDuration}s transform`;

export function getSlideInStyle(visible: boolean, nth: number = 0) {
  return {
    transform: `translate(0, ${visible ? 0 : slideInYOffset}px)`,
    opacity: visible ? 1 : 0,
    transitionDelay: visible ? `${nth * slideInDelay}s` : '0s'
  };
}
