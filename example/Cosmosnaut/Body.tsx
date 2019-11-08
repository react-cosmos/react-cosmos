import React from 'react';
import { translatePath } from './helpers/translatePath';

const torsoPath = translatePath(
  'M412.01 377.72C427.97 383.6 429.07 397.83 423.23 413.97C423.23 413.97 421.75 428.06 413.2 442.12C414.75 450.9 410.52 486.5 373.11 474.28C356.94 469 350.36 456.77 356.21 440.63L372.53 396.32C378.37 380.17 396.05 371.85 412.01 377.72Z'
);
const torsoPath2 = translatePath(
  'M396.55 435.16C380.89 435.16 367.87 446.41 365.05 461.29C360.09 455.63 357.07 448.23 357.07 440.1C357.07 422.34 371.43 407.94 389.14 407.94C406.86 407.94 421.22 422.34 421.22 440.1C421.22 442.17 421.01 444.18 420.64 446.13C414.76 439.42 406.16 435.16 396.55 435.16Z'
);
const torsoPath3 = translatePath(
  'M391.93 423.49C375.59 426.45 364.12 440.66 363.98 456.72C357.74 451.75 353.19 444.6 351.66 436.12C348.32 417.58 360.59 399.84 379.08 396.49C397.57 393.13 415.27 405.44 418.61 423.98C419 426.14 419.15 428.27 419.13 430.38C411.74 424.49 401.96 421.67 391.93 423.49Z'
);
const leftLegPath = translatePath(
  `M393.15 474.28C394.39 478 399.9 473.56 401.17 476.29C402.89 479.99 402.86 484.35 403.18 486.35C403.77 490.11 407.22 491.71 412.36 491.35C426.75 490.36 422.99 471.43 422 465C420.76 457 417.55 453.8 411.2 452.17C401.08 449.57 389.79 464.21 393.15 474.28Z`
);
const leftLegShadowPath = translatePath(
  `M418 488C419.01 481.94 424.83 463.61 420 455C416.7 449.12 414.02 443.66 392.55 459.06C400.89 451.15 411.7 428.97 424.08 428.89C450.04 428.72 446.8 442.96 446.97 468.98C447.14 495 443.95 487.82 418 488Z`
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

export function Body() {
  return (
    <>
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
        strokeOpacity={0.89}
        clipPath="url(#torsoMask)"
      />

      <defs>
        <linearGradient id="leftLegGrad">
          <stop offset="0" stopColor="#839eb3" stopOpacity={0.9} />
          <stop offset="0.9" stopColor="#c3d3e1" stopOpacity={0.3} />
        </linearGradient>
        <clipPath id="leftLegMask">
          <path d={leftLegPath} />
        </clipPath>
        <clipPath id="leftFootMask">
          <path d={leftFootPath} />
        </clipPath>
      </defs>
      <path d={leftFootPath} fill="#fff" filter="url(#torsoShadow)" />
      <path
        d={leftFootShadowPath}
        fill="url(#leftLegGrad)"
        clipPath="url(#leftFootMask)"
      />
      <path d={leftLegPath} fill="#fff" filter="url(#torsoShadow)" />
      <path
        d={leftLegShadowPath}
        fill="url(#leftLegGrad)"
        clipPath="url(#leftLegMask)"
      />

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
      <path d={rightFootPath} fill="#fff" filter="url(#rightFootShadow)" />
      <path
        d={rightFootShadowPath}
        fill="url(#rightFootShadowGrad)"
        clipPath="url(#rightFootMask)"
      />
      <path d={rightLegPath} fill="#fff" filter="url(#rightLegShadow)" />
      <path
        d={rightLegShadowPath}
        fill="url(#rightLegShadowGrad)"
        clipPath="url(#rightLegMask)"
      />
    </>
  );
}
