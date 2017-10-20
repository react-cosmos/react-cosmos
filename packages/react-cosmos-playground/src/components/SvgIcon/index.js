import React from 'react';
import { string } from 'prop-types';

const SvgIcon = ({ d }) => (
  <svg viewBox="0 0 24 24">
    <path d={d} />
  </svg>
);

SvgIcon.propTypes = {
  d: string
};

export default SvgIcon;

export const FolderIcon = () => (
  <SvgIcon d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
);

export const SearchIcon = () => (
  <SvgIcon d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
);

export const HomeIcon = () => (
  <SvgIcon d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
);

export const FullScreenIcon = () => (
  <SvgIcon d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
);

export const CodeIcon = () => (
  <SvgIcon d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
);

export const DownArrowIcon = () => (
  <SvgIcon d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
);

export const RightArrowIcon = () => (
  <SvgIcon d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
);
