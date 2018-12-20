// @flow

import React from 'react';
import styled from 'styled-components';

export const ChevronRightIcon = () => (
  <Icon>
    <polyline points="9 18 15 12 9 6" />
  </Icon>
);

export const ChevronDownIcon = () => (
  <Icon>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);

export const FolderIcon = () => (
  <Icon>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </Icon>
);

export const XIcon = () => (
  <Icon>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

export const MaximizeIcon = () => (
  <Icon>
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </Icon>
);

type SvgElementType = React$Element<
  'path' | 'polyline' | 'line' | 'circle' | 'rect'
>;

function Icon({ children }: { children: SvgElementType | SvgElementType[] }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
`;
