import React from 'react';
import styled from 'styled-components';
import { translatePath } from './helpers/translatePath';

const torsoPath = translatePath(
  'M412.01 377.72C427.97 383.6 429.07 397.83 423.23 413.97C423.23 413.97 421.75 428.06 413.2 442.12C414.75 450.9 410.52 486.5 373.11 474.28C356.94 469 350.36 456.77 356.21 440.63L372.53 396.32C378.37 380.17 396.05 371.85 412.01 377.72Z'
);
const torsoPath2 = translatePath(
  'M396.55 435.16C380.89 435.16 367.87 446.41 365.05 461.29C360.09 455.63 357.07 448.23 357.07 440.1C357.07 422.34 371.43 407.94 389.14 407.94C406.86 407.94 421.22 422.34 421.22 440.1C421.22 442.17 421.01 444.18 420.64 446.13C414.76 439.42 406.16 435.16 396.55 435.16Z'
);
const torsoPath3 = translatePath(
  'M391.93 423.49C375.59 426.45 364.12 440.66 363.98 456.72C357.74 451.75 353.19 444.6 351.66 436.12C348.32 417.58 360.59 399.84 379.08 396.49C397.57 393.13 415.27 405.44 418.61 423.98C419 426.14 419.15 428.27 419.13 430.38C411.74 424.49 401.96 421.67 391.93 423.49Z',
  -1,
  1
);
const leftLegPath = translatePath(
  `M393.15 474.28C394.39 478 399.9 473.56 401.17 476.29C402.89 479.99 402.86 484.35 403.18 486.35C403.77 490.11 407.22 491.71 412.36 491.35C426.75 490.36 422.99 471.43 422 465C420.76 457 417.55 453.8 411.2 452.17C401.08 449.57 389.79 464.21 393.15 474.28Z`
);
const leftLegShadowPath = translatePath(
  `M418 488C419.01 481.94 424.83 463.61 420 455C416.7 449.12 410.02 443.66 392.55 459.06C400.89 451.15 411.7 428.97 424.08 428.89C450.04 428.72 446.8 442.96 446.97 468.98C447.14 495 443.95 487.82 418 488Z`,
  -1.3,
  -1
);
const leftFootPath = translatePath(
  `M406.39 473.47C394.75 488.46 401.16 494.74 409.55 499.42C415.42 502.68 422.97 503.78 427.24 498.41C431 493.67 425.14 483.04 419.36 479.2L413.65 473.32C407.86 469.49 410.59 468.05 406.39 473.47Z`
);
const leftFootShadowPath = translatePath(
  `M418.59 513.29C420.17 507.36 428.28 501.34 419.97 489.27C416.15 483.71 404.9 482.98 396 491C401.06 472.19 418.32 453.78 430.65 454.9C456.5 457.23 451.9 471.09 449.57 497.01C447.24 522.93 444.44 515.63 418.59 513.29Z`
);

const rightFootPath = translatePath(
  `M365.82 472.36C372.98 473.1 378.19 479.51 377.46 486.69L376.64 494.69C375.9 501.87 369.5 507.1 362.35 506.36C355.19 505.63 349.98 499.21 350.71 492.03L351.05 484.34C351.79 477.16 358.66 471.63 365.82 472.36Z`
);
const rightFootShadowPath = translatePath(
  `M366.59 510.29C368.17 504.36 376.28 498.34 367.97 486.27C364.15 480.71 356.9 486.48 348 493C349.06 468.44 366.32 450.78 378.65 451.9C404.5 454.23 399.9 468.09 397.57 494.01C395.24 519.93 392.44 512.63 366.59 510.29Z`
);
const rightLegPath = translatePath(
  `M369.1 454.18C375.56 456.3 383.23 466.65 381.12 474.28L376.18 484.07C374.08 491.7 367.14 496.17 360.67 494.05C347.63 489.78 354.06 462.72 355.06 454.18C356.06 445.63 362.63 452.06 369.1 454.18Z`
);
const rightLegShadowPath = translatePath(
  `M418.15 473.68C417.26 475.66 416.19 477.49 415 479.22C412.2 470.59 405.73 463.46 395.98 460.3C369.64 451.77 358.3 457.1 352.92 470.5C350.17 462.35 350.33 453.2 354.13 444.74C362.1 427.01 382.89 419.12 400.57 427.11C418.25 435.1 426.12 455.95 418.15 473.68Z`
);

const rightArmPath = translatePath(
  `M369.97 395.4C369.97 395.4 350.1 404.53 344.06 420.43C338.02 436.32 338.91 458.5 357.07 452.17C363.28 450 364.21 444.63 363.72 431.61L382.46 412.48C385.67 406.69 387.62 401.81 383.87 397.37C379.7 392.43 375.42 393.49 369.97 395.4Z`
);
const rightArmShadowPath = translatePath(
  `M364.69 428.18C365.7 422.13 373.19 415.35 363.76 404.14C359.42 398.98 349.22 398.86 339.55 399.06C347.89 391.15 358.7 368.97 371.08 368.89C397.04 368.72 393.8 382.96 393.97 408.98C394.14 435 390.65 428.01 364.69 428.18Z`,
  -1,
  -1.5
);

const leftArmPath = translatePath(
  `M413.09 405.57L439.63 422.36C449.25 432.16 454.66 456 435.48 453.71C428.92 452.92 426.79 449.08 422.76 437.45L400.25 422.81C395.86 417.86 393.54 414.14 398.35 409.58C403.04 405.12 408.69 400.62 413.09 405.57Z`
);
const leftArmShadowPath = translatePath(
  `M444.74 434.23C441 431.59 438.88 424.33 428.29 427.06C423.42 428.32 420.03 435.17 417.03 441.76C414.43 433.57 403.04 419.08 407 410.69C415.3 393.11 423.81 399.92 441.34 408.24C458.87 416.56 453.04 416.65 444.74 434.23Z`
);

const rightHandDetailPath = translatePath(
  `M352.05 438.09C357.04 438.09 361.08 440.79 361.08 444.13C361.08 447.46 357.04 450.16 352.05 450.16C347.07 450.16 343.03 447.46 343.03 444.13C343.03 440.79 347.07 438.09 352.05 438.09Z`,
  -0.2,
  -0.5
);
const leftHandDetailPath = translatePath(
  `M438.26 438.09C443.25 438.09 447.29 440.79 447.29 444.13C447.29 447.46 443.25 450.16 438.26 450.16C433.28 450.16 429.24 447.46 429.24 444.13C429.24 440.79 433.28 438.09 438.26 438.09Z`,
  0.7,
  -1
);
const leftLegDetailPath = translatePath(
  `M417.21 464.23C420.53 464.23 423.23 468.73 423.23 474.28C423.23 479.83 420.53 484.34 417.21 484.34C413.89 484.34 411.2 479.83 411.2 474.28C411.2 468.73 413.89 464.23 417.21 464.23Z`
);
const rightLegDetailPath = translatePath(
  `M365.09 468.25C368.41 468.25 371.1 472.75 371.1 478.3C371.1 483.86 368.41 488.36 365.09 488.36C361.76 488.36 359.07 483.86 359.07 478.3C359.07 472.75 361.76 468.25 365.09 468.25Z`
);
const torsoLinePath = translatePath(
  `M405.18 415.98C405.18 415.98 396.21 436.08 395.16 444.13C392.83 461.96 389.52 472.65 387.14 476.29`
);

const oxigenBgPath = translatePath(
  `M369.1 377.78C384.6 377.78 397.16 392.18 397.16 409.95C397.16 427.71 384.6 442.12 369.1 442.12C353.59 442.12 341.03 427.71 341.03 409.95C341.03 392.18 353.59 377.78 369.1 377.78Z`
);
const oxigenPath = translatePath(
  `M372.11 375.78C387.61 375.78 400.17 390.18 400.17 407.95C400.17 425.71 387.61 440.12 372.11 440.12C356.6 440.12 344.04 425.71 344.04 407.95C344.04 390.18 356.6 375.78 372.11 375.78Z`
);
const oxigenShadowPath = translatePath(
  `M350.19 413.48C352.86 407.95 361.95 403.56 356.06 390.14C353.34 383.96 343.59 380.97 334.25 378.43C344.47 373.2 361.08 354.97 372.98 358.39C397.93 365.55 390.82 378.3 383.68 403.32C376.53 428.34 375.14 420.64 350.19 413.48Z`
);

export function Body() {
  const tubePath = `M144.00 78.00C144.00 78.00 105.52 59.22 96.00 86.00C84.29 118.95 142.01 127.95 128.00 180.00C114.00 232.00 43.40 239.00 20.00 202.00`;
  return (
    <>
      <defs>
        <linearGradient id="tubeGrad" x1="0.7" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#92b1c7" />
          <stop offset="1" stopColor="#d7e1e8" />
        </linearGradient>
        <filter id="tubeBevel" x="-100%" y="-100%" width="200%" height="300%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="12"
            specularConstant="1"
            specularExponent="5"
            result="specOut"
            lightingColor="#92b1c7"
          >
            <fePointLight x="20000" y="20000" z="20000" />
          </feSpecularLighting>
          <feComposite
            in="specOut"
            in2="SourceAlpha"
            operator="in"
            result="specOut2"
          />
          <feComposite
            in="SourceGraphic"
            in2="specOut2"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litPaint"
          />
        </filter>
        <filter id="tubeBlur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
      </defs>
      <g clipPath="url(#mainCircleMask)" filter="url(#tubeBlur)">
        <TubePath d={tubePath} filter="url(#tubeBevel)" />
      </g>

      <defs>
        <clipPath id="oxigenMask">
          <path d={oxigenBgPath} />
        </clipPath>
      </defs>
      <path d={oxigenBgPath} fill="#c2d4df" />
      <g filter="url(#rightFootShadow)">
        <path d={oxigenPath} fill="#eaedef" />
        <path
          d={oxigenShadowPath}
          fill="url(#leftArmShadowGrad)"
          clipPath="url(#oxigenMask)"
        />
      </g>

      <defs>
        <clipPath id="leftArmMask">
          <path d={leftArmPath} />
        </clipPath>
        <linearGradient id="leftArmShadowGrad" gradientTransform="rotate(55)">
          <stop offset="0" stopColor="#839eb3" />
          <stop offset="0.901" stopColor="#c3d3e1" />
        </linearGradient>
      </defs>
      <g filter="url(#rightFootShadow)">
        <path d={leftArmPath} fill="#d4dfe7" />
        <path
          d={leftArmShadowPath}
          fill="url(#leftArmShadowGrad)"
          clipPath="url(#leftArmMask)"
        />
      </g>

      <defs>
        <linearGradient id="torsoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="70%" stopColor="#eaedef" />
          <stop offset="100%" stopColor="#a7c2d4" />
        </linearGradient>
        <clipPath id="torsoMask">
          <path d={torsoPath} fill="url(#torsoGrad)" />
        </clipPath>
        <filter id="torsoShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="3" />
          <feOffset dx="6" dy="6" result="offsetblur" />
          <feFlood floodColor="#95b5c9" floodOpacity={0.75} result="color" />
          <feComposite in2="offsetblur" operator="in" />
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>
        <linearGradient id="torsoGrad2" x1="0%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#99b5cb" stopOpacity={1} />
          <stop offset="89%" stopColor="#ffffff" stopOpacity={1} />
        </linearGradient>
      </defs>
      <g filter="url(#torsoShadow)">
        <path d={torsoPath} fill="url(#torsoGrad)" />
        <path
          d={torsoPath2}
          fill="url(#torsoGrad2)"
          clipPath="url(#torsoMask)"
        />
        <path d={torsoPath3} fill="#a8c3d7" clipPath="url(#torsoMask)" />
      </g>
      <path
        d={torsoPath}
        fill="transparent"
        strokeWidth="4"
        stroke="#c5d5df"
        clipPath="url(#torsoMask)"
      />

      <defs>
        <linearGradient id="leftLegGrad">
          <stop offset="0" stopColor="#839eb3" stopOpacity={0.6} />
          <stop offset="0.9" stopColor="#c3d3e1" stopOpacity={0.2} />
        </linearGradient>
        <clipPath id="leftLegMask">
          <path d={leftLegPath} />
        </clipPath>
        <clipPath id="leftFootMask">
          <path d={leftFootPath} />
        </clipPath>
      </defs>
      <g filter="url(#torsoShadow)">
        <path d={leftFootPath} fill="#d4dfe7" />
        <path
          d={leftFootShadowPath}
          fill="url(#leftLegGrad)"
          clipPath="url(#leftFootMask)"
        />
      </g>
      <g filter="url(#torsoShadow)">
        <path d={leftLegPath} fill="#d4dfe7" />
        <path
          d={leftLegShadowPath}
          fill="url(#leftLegGrad)"
          clipPath="url(#leftLegMask)"
        />
      </g>

      <defs>
        <filter
          id="rightFootShadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="5" />
          <feOffset dx="0" dy="15" result="offsetblur" />
          <feFlood floodColor="#8bb2cd" floodOpacity={0.71} result="color" />
          <feComposite in2="offsetblur" operator="in" />
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>
        <filter
          id="rightLegShadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="4" />
          <feOffset dx="5" dy="8" result="offsetblur" />
          <feFlood floodColor="#8bb2cd" floodOpacity={0.71} result="color" />
          <feComposite in2="offsetblur" operator="in" />
          <feComposite in2="SourceAlpha" operator="in" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode />
          </feMerge>
        </filter>
        <clipPath id="rightFootMask">
          <path d={rightFootPath} />
        </clipPath>
        <clipPath id="rightLegMask">
          <path d={rightLegPath} />
        </clipPath>
        <linearGradient
          id="rightFootShadowGrad"
          x1="100%"
          y1="0%"
          x2="50%"
          y2="100%"
        >
          <stop offset="0" stopColor="#839eb3" />
          <stop offset="0.85" stopColor="#d3dfe7" />
        </linearGradient>
        <linearGradient id="rightLegShadowGrad" gradientTransform="rotate(55)">
          <stop offset="0.3" stopColor="#839eb3" />
          <stop offset="0.85" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <g filter="url(#rightFootShadow)">
        <path d={rightFootPath} fill="#d4dfe7" />
        <path
          d={rightFootShadowPath}
          fill="url(#rightFootShadowGrad)"
          clipPath="url(#rightFootMask)"
        />
      </g>
      <g filter="url(#rightLegShadow)">
        <path d={rightLegPath} fill="#d4dfe7" />
        <path
          d={rightLegShadowPath}
          fill="url(#rightLegShadowGrad)"
          clipPath="url(#rightLegMask)"
        />
      </g>

      <defs>
        <clipPath id="rightArmMask">
          <path d={rightArmPath} />
        </clipPath>
        <linearGradient id="rightArmShadowGrad" gradientTransform="rotate(55)">
          <stop offset="0" stopColor="#839eb3" />
          <stop offset="0.901" stopColor="#c3d3e1" />
        </linearGradient>
      </defs>
      <g filter="url(#rightFootShadow)">
        <path d={rightArmPath} fill="#d4dfe7" />
        <path
          d={rightArmShadowPath}
          fill="url(#rightArmShadowGrad)"
          clipPath="url(#rightArmMask)"
        />
      </g>

      <defs>
        <radialGradient id="legDetailGrad" r="0.6">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#f0f2f4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="handDetailGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9edef" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="torsoLineGrad">
          <stop offset="0" stopColor="#5895c5" />
          <stop offset="1" stopColor="#47779b" />
        </linearGradient>
        <filter
          id="handDetailBlur"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
      </defs>
      <path
        d={rightHandDetailPath}
        fill="url(#handDetailGrad)"
        filter="url(#handDetailBlur)"
        opacity="0.7"
      />
      <path
        d={leftHandDetailPath}
        fill="url(#handDetailGrad)"
        filter="url(#handDetailBlur)"
        opacity="0.7"
      />
      <path d={leftLegDetailPath} fill="url(#legDetailGrad)" opacity="0.5" />
      <path d={rightLegDetailPath} fill="url(#legDetailGrad)" opacity="0.5" />
      <TorsoLinePath d={torsoLinePath} />
    </>
  );
}

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
