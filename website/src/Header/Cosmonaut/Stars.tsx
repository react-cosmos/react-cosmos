import React from 'react';
import { translateOriginalPath } from './helpers/translatePath';
import styled from 'styled-components';

const star1Path = translateOriginalPath(
  `M267 378.57C268.34 378.57 269.43 379.66 269.43 381C269.43 382.34 268.34 383.43 267 383.43C265.66 383.43 264.57 382.34 264.57 381C264.57 379.66 265.66 378.57 267 378.57Z`
);
const star2Path = translateOriginalPath(
  `M411 520.57C412.34 520.57 413.43 521.66 413.43 523C413.43 524.34 412.34 525.43 411 525.43C409.66 525.43 408.57 524.34 408.57 523C408.57 521.66 409.66 520.57 411 520.57Z`
);
const star3Path = translateOriginalPath(
  `M331 339.78C331.67 339.78 332.21 340.33 332.21 341C332.21 341.67 331.67 342.21 331 342.21C330.33 342.21 329.78 341.67 329.78 341C329.78 340.33 330.33 339.78 331 339.78Z`
);
const star4Path = translateOriginalPath(
  `M285 399.78C285.67 399.78 286.21 400.33 286.21 401C286.21 401.67 285.67 402.21 285 402.21C284.33 402.21 283.78 401.67 283.78 401C283.78 400.33 284.33 399.78 285 399.78Z`
);
const star5Path = translateOriginalPath(
  `M437 463.78C437.67 463.78 438.21 464.33 438.21 465C438.21 465.67 437.67 466.21 437 466.21C436.33 466.21 435.78 465.67 435.78 465C435.78 464.33 436.33 463.78 437 463.78Z`
);
const star6Path = translateOriginalPath(
  `M379 513.78C379.67 513.78 380.21 514.33 380.21 515C380.21 515.67 379.67 516.21 379 516.21C378.33 516.21 377.78 515.67 377.78 515C377.78 514.33 378.33 513.78 379 513.78Z`
);
const star7Path = translateOriginalPath(
  `M307 366C308.66 366 310 367.34 310 369C310 370.66 308.66 372 307 372C305.34 372 304 370.66 304 369C304 367.34 305.34 366 307 366Z`
);

export function Stars() {
  return (
    <>
      <defs>
        {/* <filter id="starGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur
            result="coloredBlur"
            stdDeviation="1.6"
          ></feGaussianBlur>
          <feMerge>
            <feMergeNode in="SourceGraphic"></feMergeNode>
            <feMergeNode in="coloredBlur"></feMergeNode>
            <feMergeNode in="coloredBlur"></feMergeNode>
          </feMerge>
        </filter> */}
      </defs>
      <Star d={star1Path} />
      <Star d={star2Path} />
      <Star d={star3Path} />
      <Star d={star4Path} />
      <Star d={star5Path} />
      <Star d={star6Path} />
      <Star d={star7Path} />
    </>
  );
}

const Star = styled.path`
  fill: #bde0f6;
  /* filter: url(#starGlow); */
`;
