import React from 'react';
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
        <circle
          key={index}
          cx={star.x}
          cy={star.y}
          r={star.r}
          fill="url(#starGlow)"
        />
      ))}
    </>
  );
});
