import React from 'react';
import styled from 'styled-components';

const torsoPath =
  'M204.01 59.72C219.97 65.60 221.07 79.83 215.23 95.97C215.23 95.97 213.75 110.06 205.20 124.12C206.75 132.90 202.52 168.50 165.11 156.28C148.94 151.00 142.36 138.77 148.21 122.63L164.53 78.32C170.37 62.17 188.05 53.85 204.01 59.72';
const torsoPath2 =
  'M188.55 117.16C172.89 117.16 159.87 128.41 157.05 143.29C152.09 137.63 149.07 130.23 149.07 122.10C149.07 104.34 163.43 89.94 181.14 89.94C198.86 89.94 213.22 104.34 213.22 122.10C213.22 124.17 213.01 126.18 212.64 128.13C206.76 121.42 198.16 117.16 188.55 117.16';
const torsoPath3 =
  'M184.93 104.49C168.59 107.45 157.12 121.66 156.98 137.72C150.74 132.75 146.19 125.60 144.66 117.12C141.32 98.58 153.59 80.84 172.08 77.49C190.57 74.13 208.27 86.44 211.61 104.98C212.00 107.14 212.15 109.27 212.13 111.38C204.74 105.49 194.96 102.67 184.93 104.49';

const leftLegPath =
  'M185.15 156.28C186.39 160.00 191.90 155.56 193.17 158.29C194.89 161.99 194.86 166.35 195.18 168.35C195.77 172.11 199.22 173.71 204.36 173.35C218.75 172.36 214.99 153.43 214.00 147.00C212.76 139.00 209.55 135.80 203.20 134.17C193.08 131.57 181.79 146.21 185.15 156.28';
const leftLegShadowPath =
  'M211.30 171.00C212.31 164.94 218.13 146.61 213.30 138.00C210.00 132.12 203.32 126.66 185.85 142.06C194.19 134.15 205.00 111.97 217.38 111.89C243.34 111.72 240.10 125.96 240.27 151.98C240.44 178.00 237.25 170.82 211.30 171.00';
const leftFootPath =
  'M198.39 155.47C186.75 170.46 193.16 176.74 201.55 181.42C207.42 184.68 214.97 185.78 219.24 180.41C223.00 175.67 217.14 165.04 211.36 161.20L205.65 155.32C199.86 151.49 202.59 150.05 198.39 155.47';
const leftFootShadowPath =
  'M210.59 195.29C212.17 189.36 220.28 183.34 211.97 171.27C208.15 165.71 196.90 164.98 188.00 173.00C193.06 154.19 210.32 135.78 222.65 136.90C248.50 139.23 243.90 153.09 241.57 179.01C239.24 204.93 236.44 197.63 210.59 195.29';

const rightFootPath =
  'M156.32 154.36C163.48 155.10 168.69 161.51 167.96 168.69L167.14 176.69C166.40 183.87 160.00 189.10 152.85 188.36C145.69 187.63 140.48 181.21 141.21 174.03L141.55 166.34C142.29 159.16 149.16 153.63 156.32 154.36';
const rightFootShadowPath =
  'M157.09 192.29C158.67 186.36 166.78 180.34 158.47 168.27C154.65 162.71 147.40 168.48 138.50 175.00C139.56 150.44 156.82 132.78 169.15 133.90C195.00 136.23 190.40 150.09 188.07 176.01C185.74 201.93 182.94 194.63 157.09 192.29';
const rightLegPath =
  'M159.60 136.18C166.06 138.30 173.73 148.65 171.62 156.28L166.68 166.07C164.58 173.70 157.64 178.17 151.17 176.05C138.13 171.78 144.56 144.72 145.56 136.18C146.56 127.63 153.13 134.06 159.60 136.18';
const rightLegShadowPath =
  'M208.65 155.68C207.76 157.66 206.69 159.49 205.50 161.22C202.70 152.59 196.23 145.46 186.48 142.30C160.14 133.77 148.80 139.10 143.42 152.50C140.67 144.35 140.83 135.20 144.63 126.74C152.60 109.01 173.39 101.12 191.07 109.11C208.75 117.10 216.62 137.95 208.65 155.68';

const rightArmPath =
  'M161.97 77.40C161.97 77.40 142.10 86.53 136.06 102.43C130.02 118.32 130.91 140.50 149.07 134.17C155.28 132.00 156.21 126.63 155.72 113.61L174.46 94.48C177.67 88.69 179.62 83.81 175.87 79.37C171.70 74.43 167.42 75.49 161.97 77.40';
const rightArmShadowPath =
  'M158.69 111.68C159.70 105.63 167.19 98.85 157.76 87.64C153.42 82.48 143.22 82.36 133.55 82.56C141.89 74.65 152.70 52.47 165.08 52.39C191.04 52.22 187.80 66.46 187.97 92.48C188.14 118.50 184.65 111.51 158.69 111.68';

const leftArmPath =
  'M205.09 87.57L231.63 104.36C241.25 114.16 246.66 138.00 227.48 135.71C220.92 134.92 218.79 131.08 214.76 119.45L192.25 104.81C187.86 99.86 185.54 96.14 190.35 91.58C195.04 87.12 200.69 82.62 205.09 87.57';
const leftArmShadowPath =
  'M238.74 113.23C235.00 110.59 232.88 103.33 222.29 106.06C217.42 107.32 214.03 114.17 211.03 120.76C208.43 112.57 197.04 98.08 201.00 89.69C209.30 72.11 217.81 78.92 235.34 87.24C252.87 95.56 247.04 95.65 238.74 113.23';

const rightHandDetailPath =
  'M144.55 120.29C149.54 120.29 153.58 122.99 153.58 126.33C153.58 129.66 149.54 132.36 144.55 132.36C139.57 132.36 135.53 129.66 135.53 126.33C135.53 122.99 139.57 120.29 144.55 120.29';
const leftHandDetailPath =
  'M229.56 121.09C234.55 121.09 238.59 123.79 238.59 127.13C238.59 130.46 234.55 133.16 229.56 133.16C224.58 133.16 220.54 130.46 220.54 127.13C220.54 123.79 224.58 121.09 229.56 121.09';
const torsoLinePath =
  'M197.18 97.98C197.18 97.98 188.21 118.08 187.16 126.13C184.83 143.96 181.52 154.65 179.14 158.29';

const oxigenBgPath =
  'M161.60 59.28C177.10 59.28 189.66 73.68 189.66 91.45C189.66 109.21 177.10 123.62 161.60 123.62C146.09 123.62 133.53 109.21 133.53 91.45C133.53 73.68 146.09 59.28 161.60 59.28';
const oxigenPath =
  'M164.11 57.78C179.61 57.78 192.17 72.18 192.17 89.95C192.17 107.71 179.61 122.12 164.11 122.12C148.60 122.12 136.04 107.71 136.04 89.95C136.04 72.18 148.60 57.78 164.11 57.78';
const oxigenShadowPath =
  'M142.19 95.48C144.86 89.95 153.95 85.56 148.06 72.14C145.34 65.96 135.59 62.97 126.25 60.43C136.47 55.20 153.08 36.97 164.98 40.39C189.93 47.55 182.82 60.30 175.68 85.32C168.53 110.34 167.14 102.64 142.19 95.48';

export const Body = React.memo(function Body() {
  return (
    <>
      <defs>
        <linearGradient id="tubeGrad" x1="0.7" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#92b1c7" />
          <stop offset="1" stopColor="#d7e1e8" />
        </linearGradient>
      </defs>
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
