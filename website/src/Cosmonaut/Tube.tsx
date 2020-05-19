import React from 'react';
import styled from 'styled-components';

const tubePath =
  'M144.00 78.00C144.00 78.00 105.52 59.22 96.00 86.00C84.29 118.95 142.01 127.95 128.00 180.00C114.00 232.00 33.40 249.00 -5 182';

export const Tube = React.memo(function Tube() {
  return (
    <>
      <defs>
        <linearGradient id="tubeGrad" x1="0.7" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#92b1c7" />
          <stop offset="1" stopColor="#d7e1e8" />
        </linearGradient>
        <filter id="tubeBlur" x="0" y="-0.05">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.2" />
        </filter>
      </defs>
      <g filter="url(#tubeBlur)">
        <TubePath d={tubePath} />
      </g>
    </>
  );
});

const TubePath = styled.path`
  fill: none;
  stroke: url(#tubeGrad);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 6;
`;
