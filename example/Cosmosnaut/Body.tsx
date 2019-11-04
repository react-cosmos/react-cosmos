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
          <feOffset dx="6" dy="10" result="offsetblur" />
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
    </>
  );
}
