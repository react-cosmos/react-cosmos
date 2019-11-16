import React from 'react';

export function Helmet() {
  return (
    <>
      <defs>
        <radialGradient id="helmetGrad" cx="55%" cy="55%" r={0.55}>
          <stop offset="75%" stopColor="#eaedef" />
          <stop offset="100%" stopColor="#a3bfd3" />
        </radialGradient>
        <linearGradient
          id="helmetGlassGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#092d45" />
          <stop offset="100%" stopColor="#265980" />
        </linearGradient>
        <filter
          id="helmentGlassShadow"
          x="-50%"
          width="200%"
          y="-50%"
          height="200%"
        >
          <feDropShadow
            dx="-5"
            dy="-3"
            stdDeviation="2"
            floodColor="rgb(163,192,211)"
            floodOpacity={0.75}
          />
        </filter>
        <clipPath id="helmentGlassMask">
          <ellipse cx={208.5} cy={72} rx={36} ry={30.5} />
        </clipPath>
        <clipPath id="helmentGlassMask2">
          <ellipse cx={188.5} cy={60} rx={36} ry={30.5} />
        </clipPath>
        <linearGradient id="helmetGlassGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="10%" stopColor="#125689" />
          <stop offset="100%" stopColor="#073f67" />
        </linearGradient>
        <linearGradient id="helmetGlassGrad3" x1="30%" y1="0%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#3bb4e1" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#125689" stopOpacity={0} />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="54" rx="50" ry="47.5" fill="#c2d4df" />
      <ellipse cx={201} cy={55} rx={49.5} ry={46.5} fill="url(#helmetGrad)" />
      <ellipse
        cx={208.5}
        cy={72}
        rx={37}
        ry={31.5}
        fill="#0a2e46"
        strokeWidth="2"
        stroke="url(#helmetGlassGrad)"
        filter="url(#helmentGlassShadow)"
      />
      <ellipse
        cx={212.5}
        cy={83}
        rx={36}
        ry={30.5}
        fill="url(#helmetGlassGrad2)"
        clipPath="url(#helmentGlassMask)"
      />
      <ellipse
        cx={204}
        cy={65}
        rx={36}
        ry={30.5}
        fill="url(#helmetGlassGrad3)"
        clipPath="url(#helmentGlassMask)"
      />
      <ellipse
        cx={188.5}
        cy={60}
        rx={36}
        ry={30.5}
        fill="#0a2e46"
        clipPath="url(#helmentGlassMask)"
      />
      <g clipPath="url(#helmentGlassMask)">
        <ellipse
          cx={212.5}
          cy={83}
          rx={36}
          ry={30.5}
          fill="url(#helmetGlassGrad2)"
          clipPath="url(#helmentGlassMask2)"
        />
      </g>
    </>
  );
}
