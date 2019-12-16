import React from 'react';
import styled from 'styled-components';
import { stars } from './shared/stars';

export const Stars = React.memo(function Stars() {
  return (
    <>
      <defs>
        <radialGradient id="starGlow" r={0.5}>
          <stop offset="30%" stopColor="#bde0f6" />
          <stop offset="100%" stopColor="#2b7fc0" stopOpacity={0} />
        </radialGradient>
      </defs>
      {stars.map((star, index) => (
        <Star key={index} cx={star.x} cy={star.y} r={star.r} />
      ))}
    </>
  );
});

const Star = styled.circle`
  fill: url(#starGlow);
`;
