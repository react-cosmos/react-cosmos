import React from 'react';
import styled from 'styled-components';

export const Center = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;

export const SlideIn = styled.div<{ visible: boolean }>`
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: translate(0, ${props => (props.visible ? 0 : 40)}px);
  transition: 0.8s opacity, 1.2s transform;
`;

export const Heart = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};
