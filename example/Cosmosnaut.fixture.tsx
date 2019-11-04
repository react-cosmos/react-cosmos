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
        <linearGradient id="earthBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2170a2', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#1573aa', stopOpacity: 1 }}
          />
        </linearGradient>
        <radialGradient
          id="oceanGrad"
          cx="50%"
          cy="50%"
          r="50%"
          fx="43%"
          fy="65%"
        >
          <stop offset="0%" style={{ stopColor: '#5ac1ea', stopOpacity: 1 }} />
          <stop offset="89%" style={{ stopColor: '#064a87', stopOpacity: 1 }} />
        </radialGradient>
        <filter id="earthGlow" y="-50%" width="150%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="30"
            floodColor="#2b7fc0"
            floodOpacity={1}
          />
        </filter>
        <clipPath id="mainCircleMask">
          <circle cx="128" cy="128" r="128" />
        </clipPath>
        <clipPath id="planetMask">
          <circle cx="24" cy="215" r="114" />
        </clipPath>
        <radialGradient id="earthGrad" cx={-7} cy={15} r={26}>
          <stop offset="10%" style={{ stopColor: '#77db8f' }} />
          <stop offset="99%" style={{ stopColor: '#419755' }} />
        </radialGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="256"
        height="256"
        fill="#093556"
        clipPath="url(#mainCircleMask)"
      />
      <circle
        cx="24"
        cy="215"
        r="114"
        fill="url(#earthBaseGrad)"
        clipPath="url(#mainCircleMask)"
        style={{ filter: 'url(#earthGlow)' }}
      />
      <circle
        cx="24"
        cy="215"
        r="111"
        fill="url(#oceanGrad)"
        clipPath="url(#mainCircleMask)"
      />
      <Continents />
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

function Continents() {
  const xOffset = 208;
  const yOffset = 318;

  function mapPathPoints(letter: string, points: number[]): number[] {
    if (letter === 'M' || letter === 'L') {
      return [points[0] - xOffset, points[1] - yOffset];
    }

    return [
      points[0] - xOffset,
      points[1] - yOffset,
      points[2] - xOffset,
      points[3] - yOffset,
      points[4] - xOffset,
      points[5] - yOffset
    ];
  }

  const originalPath =
    'M128.98 501.02L134.95 500.39L136.52 496.2L130.13 492.85L135.46 486.25L144.89 499.33C144.89 499.33 147.71 499.79 146.67 497.13C145.63 494.48 139.65 487.82 139.65 487.82L138.81 479.86L150.11 472.63L145.71 469.08L153.03 462.27C153.03 462.27 168.85 462.1 169.37 464.56C169.88 467.02 172.83 461.68 175.12 461.94C177.41 462.2 186.63 456.7 186.63 456.7C186.63 456.7 181.59 456.56 192.81 458.06C204.03 459.55 209.26 480.45 209.26 480.45C209.26 480.45 199.66 489.51 198.8 495.63C197.94 501.76 197.28 507.36 193.89 506.21C190.5 505.06 176.29 491.98 176.29 491.98C176.29 491.98 184.86 489.82 181.63 485.39C178.39 480.95 169.81 475.83 168.43 474.72C167.06 473.6 163.98 470.66 165.81 468.96C167.64 467.26 161.76 466.37 158.28 473.78C154.79 481.19 154.2 482.76 151.37 484.57C148.55 486.38 147.82 488.97 147.82 488.97C147.82 488.97 152.92 489.68 157.97 489.9C163.02 490.12 170.66 498.11 172.95 498.37C175.24 498.63 175.28 501.39 173.37 502.35C171.46 503.31 174.4 505.01 171.8 506.54C169.2 508.07 158.27 506.97 157.67 506.02C157.07 505.08 163.2 494.13 156.61 496.08C150.03 498.03 153.31 500.45 151.49 504.67C149.67 508.88 147.25 507.38 145.95 509.28C144.64 511.17 146.38 520.54 153.39 522.57C160.39 524.59 161.43 520.21 158.93 517.96C156.43 515.71 156.27 514.22 158.3 511.99C160.33 509.76 163.37 514.72 170.65 514.7C177.94 514.69 182.45 519.24 183.64 523.39C184.83 527.53 177.39 526.06 176.11 528.21C174.83 530.35 176.37 525.92 168.99 537C161.62 548.09 158.73 551.67 160.94 555.96C163.16 560.25 163.4 562.48 159.38 560.14C155.36 557.81 149.98 552.09 145.03 557.64C140.09 563.19 143.94 571.08 146.3 569.57C148.65 568.07 148.7 563.79 152.05 566.95C155.41 570.12 157.91 577.14 161.27 578.04C164.64 578.95 170.33 578.09 175.62 580.55C180.9 583 191.38 591.7 196.98 592.36C202.58 593.03 209.33 590.3 209.54 597.07C209.76 603.83 205.03 611.37 205.26 613.61C205.5 615.85 204.43 615.21 199.72 618.22C195.01 621.23 192.23 630.58 189.26 633.41C186.29 636.23 188.02 638.31 181.94 640.21C175.85 642.12 172.17 633.46 172.72 629.12C173.26 624.79 174.55 615.61 171.03 613.21C167.51 610.82 163.03 611.29 160.03 604.32C157.03 597.35 153.24 594.73 158.56 590.4C163.88 586.06 164.39 583.75 161.69 582.02C159 580.3 155.43 575.14 148.92 575.33C142.4 575.52 136.76 572.09 134.15 568.85C131.55 565.61 131.94 565.11 125.57 563.73C106.14 559.5 128.98 501.02 128.98 501.02ZM163.99 565.69C163.99 565.69 164.38 559.87 167.54 561.29C170.71 562.72 173.93 564.64 174.14 566.63C174.35 568.61 163.99 565.69 163.99 565.69ZM206.13 488.82C207.26 487.7 211.32 488.02 214.08 487.98C216.84 487.94 217.3 489.9 214.5 491.96C209.48 495.65 204.99 489.95 206.13 488.82ZM243.17 458.76C243.32 457.86 245.7 454.21 250.7 453.94C255.7 453.66 260.54 456.67 259.08 457.07C257.61 457.48 248.7 461.19 247.35 460.32C246.01 459.46 243.01 459.65 243.17 458.76ZM264.95 474.55C260.92 474.47 249.58 478.94 247.68 482.41C245.79 485.88 238.67 489.9 238.79 493.41C238.91 496.92 241.91 499.11 243.4 498.96C244.89 498.8 257.07 487.96 258.68 491.3C260.29 494.65 259.66 493.46 257.32 497.48C254.98 501.5 247.38 503.31 243.82 502.93C240.26 502.56 238.16 504.04 236.29 507.75C234.42 511.47 228.3 515.39 229.17 516.55C230.05 517.72 227.11 516.02 225.83 522.94C224.55 529.86 224.76 531.85 228.66 530.68C232.56 529.52 244.3 516.96 247.5 518.63C249.55 519.71 252.67 522.02 255.65 523.63C257.3 524.52 258.91 525.2 260.27 525.33C261.14 525.41 258.39 519.51 259.64 519.36C261.33 519.15 267.12 524.64 268.86 524.48C271.5 524.25 273.78 524.39 274.4 525.84C275.74 528.97 272.54 534.33 267.08 532.65C261.62 530.96 247.93 525.12 242.37 527.22C236.81 529.32 228.83 529.91 227.09 534.87C225.35 539.83 217.24 551 223.65 559.37C230.07 567.74 240.05 559.9 248.57 566.79C257.1 573.68 259.21 581.75 258.42 583.85C257.64 585.94 258.94 595.86 262.1 599.55C265.25 603.23 264.09 608.89 269.12 608.86C274.14 608.83 280.27 597.87 283.34 591.26C286.41 584.65 291.37 581.61 287.63 574.72C283.88 567.83 292.16 562.93 294.11 559.95C296.05 556.98 285.05 550.36 282.69 547.09C280.33 543.82 282.27 543.11 282.27 543.11C282.27 543.11 287.79 548.96 291.06 550.22C295.91 552.1 308.11 541.32 304.14 540.79C294.2 539.46 291.37 534.1 291.37 534.1C291.37 534.1 299.04 535.3 305.71 536.6C312.39 537.91 318.2 545.34 323.31 550.83C328.41 556.32 331.68 553.96 331.68 553.96C331.68 553.96 328.74 547.49 330.63 544.02C332.53 540.55 330.84 536.46 335.97 537.42C341.1 538.39 348.73 551.15 351.36 549.87C353.99 548.58 351.97 517.63 351.97 517.63L325.97 462.05C325.97 462.05 308.84 462.86 306.51 468.14C305.96 469.37 311.12 473.68 311.12 473.68C311.12 473.68 292.68 472.87 287.25 476.21C281.82 479.55 269.98 484.07 269.98 484.07C269.98 484.07 279.56 479.54 275.32 477.48C271.07 475.41 268.98 474.63 264.95 474.55ZM305.03 454.22C305.03 454.22 290.2 461.32 290.17 465.85C290.15 470.37 292.58 469.61 292.58 469.61C292.58 469.61 296.1 464.69 297.92 463.01C301.01 460.17 311.21 455.57 311.21 455.57L305.03 454.22ZM298.41 581.62C296.72 581.05 293.23 584.94 293.08 588.22C292.92 591.5 294.26 599.41 296.12 597.95C297.98 596.5 299.94 591.27 299.25 589.58C298.57 587.89 300.11 582.2 298.41 581.62ZM227.49 500.64C224.28 502.36 219.71 508.56 224.56 511.01C227.25 512.36 227.73 507.65 230.11 506.4C232.49 505.14 235.5 505.07 233.67 502C231.92 499.08 230.7 498.92 227.49 500.64Z';
  const pathParts = originalPath.replace(/(M|L|C)/g, `\n$1`).split(`\n`);
  pathParts.shift();
  const newPathPaths = pathParts.map(part => {
    const letter = part[0];
    const points = part
      .slice(1)
      .split(' ')
      .map(point => parseFloat(point));
    const convertedPoints = mapPathPoints(letter, points);
    return `${letter}${convertedPoints.map(point => String(point)).join(' ')}`;
  });
  const newPath = newPathPaths.join('');
  return (
    <g clipPath="url(#mainCircleMask)">
      <g
        fill="url(#earthGrad)"
        clipPath="url(#planetMask)"
        style={{ opacity: 0.47 }}
      >
        <path d={newPath}></path>
      </g>
    </g>
  );
}

// Helpers

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

type RadialGradientProps = {
  id: string;
  cx: number;
  cy: number;
  r: number;
  stopOffset1: number;
  stopOffset2: number;
  stopColor1: string;
  stopColor2: string;
};

function RadialGradient(props: RadialGradientProps) {
  const [cx] = useValue('cx', { defaultValue: props.cx });
  const [cy] = useValue('cy', { defaultValue: props.cy });
  const [r] = useValue('r', { defaultValue: props.r });
  const [stopOffset1] = useValue('stopOffset1', {
    defaultValue: props.stopOffset1
  });
  const [stopOffset2] = useValue('stopOffset2', {
    defaultValue: props.stopOffset2
  });
  const [stopColor1] = useValue('stopColor1', {
    defaultValue: props.stopColor1
  });
  const [stopColor2] = useValue('stopColor2', {
    defaultValue: props.stopColor2
  });
  return (
    <radialGradient id={props.id} cx={cx} cy={cy} r={r}>
      <stop offset={`${stopOffset1}%`} style={{ stopColor: stopColor1 }} />
      <stop offset={`${stopOffset2}%`} style={{ stopColor: stopColor2 }} />
    </radialGradient>
  );
}
