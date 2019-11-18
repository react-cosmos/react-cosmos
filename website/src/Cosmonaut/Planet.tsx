import React from 'react';
import styled from 'styled-components';
import { VerticalGradient } from './helpers/VerticalGradient';

export const Planet = React.memo(function Planet() {
  return (
    <>
      <defs>
        <clipPath id="planetMask">
          <circle cx="24" cy="215" r="114" />
        </clipPath>
        <VerticalGradient
          id="atmosphereGradient"
          topColor="#1473aa"
          bottomColor="#216fa2"
        />
        <radialGradient
          id="oceanGradient"
          cx="50%"
          cy="50%"
          r="50%"
          fx="43%"
          fy="65%"
        >
          <stop offset="0%" stopColor="#5ac1ea" />
          <stop offset="100%" stopColor="#064a87" />
        </radialGradient>
        <radialGradient id="earthGlow" r={0.5}>
          <stop offset="72%" stopColor="#2b7fc0" />
          <stop offset="76%" stopColor="#2b7fc0" stopOpacity={0.8} />
          <stop offset="84%" stopColor="#2b7fc0" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#2b7fc0" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="continentsGradient" cx={-7} cy={15} r={26}>
          <stop offset="10%" stopColor="#77db8f" />
          <stop offset="100%" stopColor="#419755" />
        </radialGradient>
      </defs>

      <PlanetGlow />
      <PlanetAtmosphere />
      <Ocean />
      <ContinentsContainer>
        <path d="M-79.02 183.02L-73.05 182.39L-71.48 178.20L-77.87 174.85L-72.54 168.25L-63.11 181.33C-63.11 181.33 -60.29 181.79 -61.33 179.13C-62.37 176.48 -68.35 169.82 -68.35 169.82L-69.19 161.86L-57.89 154.63L-62.29 151.08L-54.97 144.27C-54.97 144.27 -39.15 144.10 -38.63 146.56C-38.12 149.02 -35.17 143.68 -32.88 143.94C-30.59 144.20 -21.37 138.70 -21.37 138.70C-21.37 138.70 -26.41 138.56 -15.19 140.06C-3.97 141.55 1.26 162.45 1.26 162.45C1.26 162.45 -8.34 171.51 -9.20 177.63C-10.06 183.76 -10.72 189.36 -14.11 188.21C-17.50 187.06 -31.71 173.98 -31.71 173.98C-31.71 173.98 -23.14 171.82 -26.37 167.39C-29.61 162.95 -38.19 157.83 -39.57 156.72C-40.94 155.60 -44.02 152.66 -42.19 150.96C-40.36 149.26 -46.24 148.37 -49.72 155.78C-53.21 163.19 -53.80 164.76 -56.63 166.57C-59.45 168.38 -60.18 170.97 -60.18 170.97C-60.18 170.97 -55.08 171.68 -50.03 171.90C-44.98 172.12 -37.34 180.11 -35.05 180.37C-32.76 180.63 -32.72 183.39 -34.63 184.35C-36.54 185.31 -33.60 187.01 -36.20 188.54C-38.80 190.07 -49.73 188.97 -50.33 188.02C-50.93 187.08 -44.80 176.13 -51.39 178.08C-57.97 180.03 -54.69 182.45 -56.51 186.67C-58.33 190.88 -60.75 189.38 -62.05 191.28C-63.36 193.17 -61.62 202.54 -54.61 204.57C-47.61 206.59 -46.57 202.21 -49.07 199.96C-51.57 197.71 -51.73 196.22 -49.70 193.99C-47.67 191.76 -44.63 196.72 -37.35 196.70C-30.06 196.69 -25.55 201.24 -24.36 205.39C-23.17 209.53 -30.61 208.06 -31.89 210.21C-33.17 212.35 -31.63 207.92 -39.01 219.00C-46.38 230.09 -49.27 233.67 -47.06 237.96C-44.84 242.25 -44.60 244.48 -48.62 242.14C-52.64 239.81 -58.02 234.09 -62.97 239.64C-67.91 245.19 -64.06 253.08 -61.70 251.57C-59.35 250.07 -59.30 245.79 -55.95 248.95C-52.59 252.12 -50.09 259.14 -46.73 260.04C-43.36 260.95 -37.67 260.09 -32.38 262.55C-27.10 265.00 -16.62 273.70 -11.02 274.36C-5.42 275.03 1.33 272.30 1.54 279.07C1.76 285.83 -2.97 293.37 -2.74 295.61C-2.50 297.85 -3.57 297.21 -8.28 300.22C-12.99 303.23 -15.77 312.58 -18.74 315.41C-21.71 318.23 -19.98 320.31 -26.06 322.21C-32.15 324.12 -35.83 315.46 -35.28 311.12C-34.74 306.79 -33.45 297.61 -36.97 295.21C-40.49 292.82 -44.97 293.29 -47.97 286.32C-50.97 279.35 -54.76 276.73 -49.44 272.40C-44.12 268.06 -43.61 265.75 -46.31 264.02C-49.00 262.30 -52.57 257.14 -59.08 257.33C-65.60 257.52 -71.24 254.09 -73.85 250.85C-76.45 247.61 -76.06 247.11 -82.43 245.73C-101.86 241.50 -79.02 183.02 -79.02 183.02M-44.01 247.69C-44.01 247.69 -43.62 241.87 -40.46 243.29C-37.29 244.72 -34.07 246.64 -33.86 248.63C-33.65 250.61 -44.01 247.69 -44.01 247.69M-1.87 170.82C-0.74 169.70 3.32 170.02 6.08 169.98C8.84 169.94 9.30 171.90 6.50 173.96C1.48 177.65 -3.01 171.95 -1.87 170.82M35.17 140.76C35.32 139.86 37.70 136.21 42.70 135.94C47.70 135.66 52.54 138.67 51.08 139.07C49.61 139.48 40.70 143.19 39.35 142.32C38.01 141.46 35.01 141.65 35.17 140.76M56.95 156.55C52.92 156.47 41.58 160.94 39.68 164.41C37.79 167.88 30.67 171.90 30.79 175.41C30.91 178.92 33.91 181.11 35.40 180.96C36.89 180.80 49.07 169.96 50.68 173.30C52.29 176.65 51.66 175.46 49.32 179.48C46.98 183.50 39.38 185.31 35.82 184.93C32.26 184.56 30.16 186.04 28.29 189.75C26.42 193.47 20.30 197.39 21.17 198.55C22.05 199.72 19.11 198.02 17.83 204.94C16.55 211.86 16.76 213.85 20.66 212.68C24.56 211.52 36.30 198.96 39.50 200.63C41.55 201.71 44.67 204.02 47.65 205.63C49.30 206.52 50.91 207.20 52.27 207.33C53.14 207.41 50.39 201.51 51.64 201.36C53.33 201.15 59.12 206.64 60.86 206.48C63.50 206.25 65.78 206.39 66.40 207.84C67.74 210.97 64.54 216.33 59.08 214.65C53.62 212.96 39.93 207.12 34.37 209.22C28.81 211.32 20.83 211.91 19.09 216.87C17.35 221.83 9.24 233.00 15.65 241.37C22.07 249.74 32.05 241.90 40.57 248.79C49.10 255.68 51.21 263.75 50.42 265.85C49.64 267.94 50.94 277.86 54.10 281.55C57.25 285.23 56.09 290.89 61.12 290.86C66.14 290.83 72.27 279.87 75.34 273.26C78.41 266.65 83.37 263.61 79.63 256.72C75.88 249.83 84.16 244.93 86.11 241.95C88.05 238.98 77.05 232.36 74.69 229.09C72.33 225.82 74.27 225.11 74.27 225.11C74.27 225.11 79.79 230.96 83.06 232.22C87.91 234.10 100.11 223.32 96.14 222.79C86.20 221.46 83.37 216.10 83.37 216.10C83.37 216.10 91.04 217.30 97.71 218.60C104.39 219.91 110.20 227.34 115.31 232.83C120.41 238.32 123.68 235.96 123.68 235.96C123.68 235.96 120.74 229.49 122.63 226.02C124.53 222.55 122.84 218.46 127.97 219.42C133.10 220.39 140.73 233.15 143.36 231.87C145.99 230.58 143.97 199.63 143.97 199.63L117.97 144.05C117.97 144.05 100.84 144.86 98.51 150.14C97.96 151.37 103.12 155.68 103.12 155.68C103.12 155.68 84.68 154.87 79.25 158.21C73.82 161.55 61.98 166.07 61.98 166.07C61.98 166.07 71.56 161.54 67.32 159.48C63.07 157.41 60.98 156.63 56.95 156.55M97.03 136.22C97.03 136.22 82.20 143.32 82.17 147.85C82.15 152.37 84.58 151.61 84.58 151.61C84.58 151.61 88.10 146.69 89.92 145.01C93.01 142.17 103.21 137.57 103.21 137.57L97.03 136.22M90.41 263.62C88.72 263.05 85.23 266.94 85.08 270.22C84.92 273.50 86.26 281.41 88.12 279.95C89.98 278.50 91.94 273.27 91.25 271.58C90.57 269.89 92.11 264.20 90.41 263.62M19.49 182.64C16.28 184.36 11.71 190.56 16.56 193.01C19.25 194.36 19.73 189.65 22.11 188.40C24.49 187.14 27.50 187.07 25.67 184.00C23.92 181.08 22.70 180.92 19.49 182.64" />
      </ContinentsContainer>
    </>
  );
});

const PlanetGlow = styled.circle.attrs({ cx: 24, cy: 215, r: 160 })`
  fill: url(#earthGlow);
`;

const PlanetAtmosphere = styled.circle.attrs({ cx: 24, cy: 215, r: 114 })`
  fill: url(#atmosphereGradient);
`;

const Ocean = styled.circle.attrs({ cx: 24, cy: 215, r: 111 })`
  fill: url(#oceanGradient);
`;

const ContinentsContainer = styled.g`
  fill: url(#continentsGradient);
  clip-path: url(#planetMask);
  opacity: 0.47;
`;
