import React from 'react';

export default function DefaultFolderIcon({ color = '#aaaaaa' }) {
  return (
    <svg width="18px" height="15px" viewBox="0 0 20 20">
      <path fill={color} d="M 0,2 l2,0 l 6,0 l2,2 l10,0 l0,15 l-20,0z" />
    </svg>
  );
}
