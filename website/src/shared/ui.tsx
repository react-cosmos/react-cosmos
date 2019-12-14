import React from 'react';
import styled from 'styled-components';

export const grayToWhiteGradient = `linear-gradient(#d6dde2, #fff)`;
export const whiteToGrayGradient = `linear-gradient(#fff, #d6dde2)`;

export const headerBg = `rgba(255, 255, 255, 0.9)`;
export const headerBorderBottom = `1px solid rgba(10, 46, 70, 0.24)`;
export const headerBackdropFilter = `saturate(180%) blur(15px)`;

export const contentMaxWidth = 960;
export const columnsWidthBreakpoint = 791;
export const mobileWidthBreakpoint = 400;

export const slideInYOffset = 40;
export const slideInOpacityDuration = 0.8;
export const slideInYDuration = 1.2;
export const slideInDelay = 0.2;
export const slideInTransition = `${slideInOpacityDuration}s opacity, ${slideInYDuration}s transform`;

export function getSlideInStyle(visible: boolean, nth: number = 0) {
  return {
    transform: `translate(0, ${visible ? 0 : slideInYOffset}px)`,
    opacity: visible ? 1 : 0,
    transitionDelay: visible ? `${nth * slideInDelay}s` : '0s'
  };
}

export const Center = styled.div`
  max-width: ${contentMaxWidth}px;
  margin: 0 auto;
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;

export const Heart = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};
