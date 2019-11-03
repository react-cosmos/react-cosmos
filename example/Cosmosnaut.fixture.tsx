import React from 'react';
import styled from 'styled-components';
import { useValue } from 'react-cosmos/fixture';

const CosmosnautContainer = styled.div`
  position: relative;
  width: 512px;
  height: 512px;
  img {
    width: 100%;
    height: 100%;
  }
`;

export default () => {
  const [transparency, setTransparency] = useValue('transparency', {
    defaultValue: true
  });
  return (
    <div onClick={() => setTransparency(!transparency)}>
      <CosmosnautContainer>
        <img src="/cosmos.png" />
        <Cosmosnaut transparency={transparency} />
      </CosmosnautContainer>
      <CosmosnautContainer>
        <img src="/cosmos.png" />
      </CosmosnautContainer>
    </div>
  );
};

type CosmosnautProps = {
  transparency: boolean;
};

function Cosmosnaut({ transparency }: CosmosnautProps) {
  return (
    <CosmosnautSvg
      viewBox="0 0 256 256"
      style={{
        opacity: transparency ? 0.5 : 1
      }}
    >
      <defs>
        <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2170a2', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#1573aa', stopOpacity: 1 }}
          />
        </linearGradient>
        <filter id="baseGlow" y="-50%" width="150%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="30"
            floodColor="#2b7fc0"
            floodOpacity={1}
          />
        </filter>
        <clipPath id="baseMask">
          <circle cx="128" cy="128" r="128" />
        </clipPath>
      </defs>
      <circle cx="128" cy="128" r="128" fill="#093556" />
      <circle
        cx="23"
        cy="217"
        r="114"
        fill="url(#baseGrad)"
        style={{ filter: 'url(#baseGlow)' }}
        clipPath="url(#baseMask)"
      />
    </CosmosnautSvg>
  );
}

const CosmosnautSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

type PlaceholderCircleProps = {
  cx: number;
  cy: number;
  r: number;
};

function PlaceholderCircle(props: PlaceholderCircleProps) {
  const [cx] = useValue('cx', { defaultValue: props.cx });
  const [cy] = useValue('cy', { defaultValue: props.cy });
  const [r] = useValue('r', { defaultValue: props.r });
  return <circle cx={cx} cy={cy} r={r} fill="red" />;
}
