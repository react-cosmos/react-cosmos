import React from 'react';
import styled from 'styled-components';
import { translateOriginalPath } from './helpers/translatePath';

const torsoPath = translateOriginalPath(
  'M412.01 377.72C427.97 383.6 429.07 397.83 423.23 413.97C423.23 413.97 421.75 428.06 413.2 442.12C414.75 450.9 410.52 486.5 373.11 474.28C356.94 469 350.36 456.77 356.21 440.63L372.53 396.32C378.37 380.17 396.05 371.85 412.01 377.72Z'
);
const torsoPath2 = translateOriginalPath(
  'M396.55 435.16C380.89 435.16 367.87 446.41 365.05 461.29C360.09 455.63 357.07 448.23 357.07 440.1C357.07 422.34 371.43 407.94 389.14 407.94C406.86 407.94 421.22 422.34 421.22 440.1C421.22 442.17 421.01 444.18 420.64 446.13C414.76 439.42 406.16 435.16 396.55 435.16Z'
);
const torsoPath3 = translateOriginalPath(
  'M391.93 423.49C375.59 426.45 364.12 440.66 363.98 456.72C357.74 451.75 353.19 444.6 351.66 436.12C348.32 417.58 360.59 399.84 379.08 396.49C397.57 393.13 415.27 405.44 418.61 423.98C419 426.14 419.15 428.27 419.13 430.38C411.74 424.49 401.96 421.67 391.93 423.49Z',
  1,
  -1
);
const leftLegPath = translateOriginalPath(
  `M393.15 474.28C394.39 478 399.9 473.56 401.17 476.29C402.89 479.99 402.86 484.35 403.18 486.35C403.77 490.11 407.22 491.71 412.36 491.35C426.75 490.36 422.99 471.43 422 465C420.76 457 417.55 453.8 411.2 452.17C401.08 449.57 389.79 464.21 393.15 474.28Z`
);
const leftLegShadowPath = translateOriginalPath(
  `M418 488C419.01 481.94 424.83 463.61 420 455C416.7 449.12 410.02 443.66 392.55 459.06C400.89 451.15 411.7 428.97 424.08 428.89C450.04 428.72 446.8 442.96 446.97 468.98C447.14 495 443.95 487.82 418 488Z`,
  1.3,
  1
);
const leftFootPath = translateOriginalPath(
  `M406.39 473.47C394.75 488.46 401.16 494.74 409.55 499.42C415.42 502.68 422.97 503.78 427.24 498.41C431 493.67 425.14 483.04 419.36 479.2L413.65 473.32C407.86 469.49 410.59 468.05 406.39 473.47Z`
);
const leftFootShadowPath = translateOriginalPath(
  `M418.59 513.29C420.17 507.36 428.28 501.34 419.97 489.27C416.15 483.71 404.9 482.98 396 491C401.06 472.19 418.32 453.78 430.65 454.9C456.5 457.23 451.9 471.09 449.57 497.01C447.24 522.93 444.44 515.63 418.59 513.29Z`
);

const rightFootPath = translateOriginalPath(
  `M365.82 472.36C372.98 473.1 378.19 479.51 377.46 486.69L376.64 494.69C375.9 501.87 369.5 507.1 362.35 506.36C355.19 505.63 349.98 499.21 350.71 492.03L351.05 484.34C351.79 477.16 358.66 471.63 365.82 472.36Z`,
  -1.5,
  0
);
const rightFootShadowPath = translateOriginalPath(
  `M366.59 510.29C368.17 504.36 376.28 498.34 367.97 486.27C364.15 480.71 356.9 486.48 348 493C349.06 468.44 366.32 450.78 378.65 451.9C404.5 454.23 399.9 468.09 397.57 494.01C395.24 519.93 392.44 512.63 366.59 510.29Z`,
  -1.5,
  0
);
const rightLegPath = translateOriginalPath(
  `M369.1 454.18C375.56 456.3 383.23 466.65 381.12 474.28L376.18 484.07C374.08 491.7 367.14 496.17 360.67 494.05C347.63 489.78 354.06 462.72 355.06 454.18C356.06 445.63 362.63 452.06 369.1 454.18Z`,
  -1.5,
  0
);
const rightLegShadowPath = translateOriginalPath(
  `M418.15 473.68C417.26 475.66 416.19 477.49 415 479.22C412.2 470.59 405.73 463.46 395.98 460.3C369.64 451.77 358.3 457.1 352.92 470.5C350.17 462.35 350.33 453.2 354.13 444.74C362.1 427.01 382.89 419.12 400.57 427.11C418.25 435.1 426.12 455.95 418.15 473.68Z`,
  -1.5,
  0
);

const rightArmPath = translateOriginalPath(
  `M369.97 395.4C369.97 395.4 350.1 404.53 344.06 420.43C338.02 436.32 338.91 458.5 357.07 452.17C363.28 450 364.21 444.63 363.72 431.61L382.46 412.48C385.67 406.69 387.62 401.81 383.87 397.37C379.7 392.43 375.42 393.49 369.97 395.4Z`
);
const rightArmShadowPath = translateOriginalPath(
  `M364.69 428.18C365.7 422.13 373.19 415.35 363.76 404.14C359.42 398.98 349.22 398.86 339.55 399.06C347.89 391.15 358.7 368.97 371.08 368.89C397.04 368.72 393.8 382.96 393.97 408.98C394.14 435 390.65 428.01 364.69 428.18Z`,
  2,
  1.5
);

const leftArmPath = translateOriginalPath(
  `M413.09 405.57L439.63 422.36C449.25 432.16 454.66 456 435.48 453.71C428.92 452.92 426.79 449.08 422.76 437.45L400.25 422.81C395.86 417.86 393.54 414.14 398.35 409.58C403.04 405.12 408.69 400.62 413.09 405.57Z`
);
const leftArmShadowPath = translateOriginalPath(
  `M444.74 434.23C441 431.59 438.88 424.33 428.29 427.06C423.42 428.32 420.03 435.17 417.03 441.76C414.43 433.57 403.04 419.08 407 410.69C415.3 393.11 423.81 399.92 441.34 408.24C458.87 416.56 453.04 416.65 444.74 434.23Z`,
  2,
  -3
);

const rightHandDetailPath = translateOriginalPath(
  `M352.05 438.09C357.04 438.09 361.08 440.79 361.08 444.13C361.08 447.46 357.04 450.16 352.05 450.16C347.07 450.16 343.03 447.46 343.03 444.13C343.03 440.79 347.07 438.09 352.05 438.09Z`,
  0.5,
  0.2
);
const leftHandDetailPath = translateOriginalPath(
  `M438.26 438.09C443.25 438.09 447.29 440.79 447.29 444.13C447.29 447.46 443.25 450.16 438.26 450.16C433.28 450.16 429.24 447.46 429.24 444.13C429.24 440.79 433.28 438.09 438.26 438.09Z`,
  -0.7,
  1
);
const torsoLinePath = translateOriginalPath(
  `M405.18 415.98C405.18 415.98 396.21 436.08 395.16 444.13C392.83 461.96 389.52 472.65 387.14 476.29`
);

const oxigenBgPath = translateOriginalPath(
  `M369.1 377.78C384.6 377.78 397.16 392.18 397.16 409.95C397.16 427.71 384.6 442.12 369.1 442.12C353.59 442.12 341.03 427.71 341.03 409.95C341.03 392.18 353.59 377.78 369.1 377.78Z`,
  0.5,
  -0.5
);
const oxigenPath = translateOriginalPath(
  `M372.11 375.78C387.61 375.78 400.17 390.18 400.17 407.95C400.17 425.71 387.61 440.12 372.11 440.12C356.6 440.12 344.04 425.71 344.04 407.95C344.04 390.18 356.6 375.78 372.11 375.78Z`
);
const oxigenShadowPath = translateOriginalPath(
  `M350.19 413.48C352.86 407.95 361.95 403.56 356.06 390.14C353.34 383.96 343.59 380.97 334.25 378.43C344.47 373.2 361.08 354.97 372.98 358.39C397.93 365.55 390.82 378.3 383.68 403.32C376.53 428.34 375.14 420.64 350.19 413.48Z`
);

const tubePath =
  'M144.00 78.00C144.00 78.00 105.52 59.22 96.00 86.00C84.29 118.95 142.01 127.95 128.00 180.00C114.00 232.00 33.40 249.00 -5 182';

export const Body = React.memo(function Body() {
  return (
    <>
      <defs>
        <linearGradient id="tubeGrad" x1="0.7" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#92b1c7" />
          <stop offset="1" stopColor="#d7e1e8" />
        </linearGradient>
      </defs>
      <g clipPath="url(#skyMask)">
        <TubePath d={tubePath} />
      </g>
      <defs>
        <clipPath id="oxigenMask">
          <path d={oxigenBgPath} />
        </clipPath>
        <clipPath id="oxigenShadowMask">
          <path d={oxigenShadowPath} />
        </clipPath>
        <radialGradient id="oxigenGrad" r="1">
          <stop offset="20%" stopColor="#eaedef" />
          <stop offset="50%" stopColor="#96bcd6" />
        </radialGradient>
        <radialGradient id="oxigenShadowGrad" r="1">
          <stop offset="20%" stopColor="#a8bdce" />
          <stop offset="55%" stopColor="#6b8fac" />
        </radialGradient>
      </defs>
      <path d={oxigenBgPath} fill="#c2d4df" />
      <path d={oxigenPath} fill="url(#oxigenGrad)" />
      <path
        d={oxigenBgPath}
        fill="url(#oxigenShadowGrad)"
        clipPath="url(#oxigenShadowMask)"
      />

      <defs>
        <clipPath id="leftArmMask">
          <path d={leftArmPath} />
        </clipPath>
        <clipPath id="leftArmShadowMask">
          <path d={leftArmShadowPath} />
        </clipPath>
        <radialGradient id="leftArmGrad" r="0.75" cy={0.8} cx={0.65}>
          <stop offset="20%" stopColor="#d2dee6" />
          <stop offset="60%" stopColor="#99b6cb" />
        </radialGradient>
        <radialGradient id="leftArmShadowGrad" r="0.75" cy={0.8} cx={0.65}>
          <stop offset="20%" stopColor="#c1d0dd" />
          <stop offset="70%" stopColor="#7196b4" />
        </radialGradient>
      </defs>
      <path d={leftArmPath} fill="url(#leftArmGrad)" />
      <path
        d={leftArmPath}
        fill="url(#leftArmShadowGrad)"
        clipPath="url(#leftArmShadowMask)"
      />

      <defs>
        <clipPath id="torsoMask">
          <path d={torsoPath} fill="url(#torsoGrad)" />
        </clipPath>
        <linearGradient id="torsoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="70%" stopColor="#eaedef" />
          <stop offset="100%" stopColor="#a7c2d4" />
        </linearGradient>
        <linearGradient id="torsoGrad2" x1="0%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#99b5cb" stopOpacity={1} />
          <stop offset="89%" stopColor="#ffffff" stopOpacity={1} />
        </linearGradient>
        <radialGradient id="torsoGrad3" r="1" cx={0.73} cy={0.8}>
          <stop offset="45%" stopColor="#a8c3d7" stopOpacity={0.6} />
          <stop offset="62%" stopColor="#85a6c0" />
        </radialGradient>
      </defs>
      <path d={torsoPath} fill="url(#torsoGrad)" />
      <path d={torsoPath2} fill="url(#torsoGrad2)" clipPath="url(#torsoMask)" />
      <path d={torsoPath3} fill="url(#torsoGrad3)" clipPath="url(#torsoMask)" />
      <path
        d={torsoPath}
        fill="transparent"
        strokeWidth="4"
        stroke="#c5d5df"
        clipPath="url(#torsoMask)"
      />

      <defs>
        <clipPath id="leftLegMask">
          <path d={leftLegPath} />
        </clipPath>
        <clipPath id="leftLegShadowMask">
          <path d={leftLegShadowPath} />
        </clipPath>
        <clipPath id="leftFootMask">
          <path d={leftFootPath} />
        </clipPath>
        <clipPath id="leftFootShadowMask">
          <path d={leftFootShadowPath} />
        </clipPath>
        <radialGradient id="leftLegGrad" r="1" cx={0.7} cy={0.65}>
          <stop offset="10%" stopColor="#e7ecf1" />
          <stop offset="90%" stopColor="#89a7bd" />
        </radialGradient>
        <radialGradient id="leftShadowLegGrad" r="1" cx={0.7} cy={0.65}>
          <stop offset="10%" stopColor="#e7ecf1" />
          <stop offset="35%" stopColor="#89a7bd" />
        </radialGradient>
        <radialGradient id="leftFootGrad" r="0.7" cx={0.6} cy={0.75}>
          <stop offset="10%" stopColor="#e7ecf1" />
          <stop offset="100%" stopColor="#89a7bd" />
        </radialGradient>
        <radialGradient id="leftFootShadowGrad" r="0.4" cx={0.6} cy={0.75}>
          <stop offset="10%" stopColor="#e7ecf1" />
          <stop offset="100%" stopColor="#89a7bd" />
        </radialGradient>
      </defs>
      <path d={leftFootPath} fill="url(#leftFootGrad)" />
      <path
        d={leftFootPath}
        fill="url(#leftFootShadowGrad)"
        clipPath="url(#leftFootShadowMask)"
      />
      <path d={leftLegPath} fill="url(#leftLegGrad)" />
      <path
        d={leftLegPath}
        fill="url(#leftShadowLegGrad)"
        clipPath="url(#leftLegShadowMask)"
      />

      <defs>
        <clipPath id="rightFootMask">
          <path d={rightFootPath} />
        </clipPath>
        <clipPath id="rightFootShadowMask">
          <path d={rightFootShadowPath} />
        </clipPath>
        <clipPath id="rightLegMask">
          <path d={rightLegPath} />
        </clipPath>
        <clipPath id="rightLegShadowMask">
          <path d={rightLegShadowPath} />
        </clipPath>
        <radialGradient id="rightLegGrad" r="1" cx={0.5} cy={0.65}>
          <stop offset="10%" stopColor="#e7ecf1" />
          <stop offset="90%" stopColor="#89a7bd" />
        </radialGradient>
        <radialGradient id="rightLegShadowGrad" r="1" cx={0.5} cy={0.65}>
          <stop offset="30%" stopColor="#e7ecf1" />
          <stop offset="70%" stopColor="#89a7bd" />
        </radialGradient>
        <radialGradient id="rightFootGrad" r="0.7" cx={0.48} cy={0.8}>
          <stop offset="20%" stopColor="#e7ecf1" />
          <stop offset="90%" stopColor="#89a7bd" />
        </radialGradient>
        <radialGradient id="rightFootShadowGrad" r="0.65" cx={0.48} cy={0.8}>
          <stop offset="10%" stopColor="#e7ecf1" />
          <stop offset="80%" stopColor="#89a7bd" />
        </radialGradient>
      </defs>
      <path d={rightFootPath} fill="url(#rightFootGrad)" />
      <path
        d={rightFootPath}
        fill="url(#rightFootShadowGrad)"
        clipPath="url(#rightFootShadowMask)"
      />
      <path d={rightLegPath} fill="url(#rightLegGrad)" />
      <path
        d={rightLegPath}
        fill="url(#rightLegShadowGrad)"
        clipPath="url(#rightLegShadowMask)"
      />

      <defs>
        <clipPath id="rightArmMask">
          <path d={rightArmPath} />
        </clipPath>
        <clipPath id="rightArmShadowMask">
          <path d={rightArmShadowPath} />
        </clipPath>
        <radialGradient id="rightArmGrad" r={2.3} cx={1} cy={1}>
          <stop offset="28%" stopColor="#d4dfe7" />
          <stop offset="50%" stopColor="#7ca1be" />
        </radialGradient>
        <radialGradient id="rightArmShadowGrad" r={2.3} cx={1} cy={1}>
          <stop offset="28%" stopColor="#bccddb" />
          <stop offset="54%" stopColor="#5a82a3" />
        </radialGradient>
      </defs>
      <path d={rightArmPath} fill="url(#rightArmGrad)" />
      <path
        d={rightArmPath}
        fill="url(#rightArmShadowGrad)"
        clipPath="url(#rightArmShadowMask)"
      />

      <defs>
        <linearGradient id="handDetailGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9edef" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="torsoLineGrad">
          <stop offset="0" stopColor="#5895c5" />
          <stop offset="1" stopColor="#47779b" />
        </linearGradient>
      </defs>
      <path d={rightHandDetailPath} fill="url(#handDetailGrad)" opacity="0.6" />
      <path d={leftHandDetailPath} fill="url(#handDetailGrad)" opacity="0.6" />
      <TorsoLinePath d={torsoLinePath} />
    </>
  );
});

const TorsoLinePath = styled.path`
  opacity: 0.2;
  fill: none;
  stroke: url(#torsoLineGrad);
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const TubePath = styled.path`
  fill: none;
  stroke: url(#tubeGrad);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 6;
`;
