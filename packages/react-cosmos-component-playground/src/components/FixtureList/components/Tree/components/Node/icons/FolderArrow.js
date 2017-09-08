import React from 'react';

const WHITE = '#eeeeee';

export default function FolderArrow({ open = false }) {
  return (
    <svg width="10px" height="10px" viewBox="0 0 10 10">
      <path
        stroke={WHITE}
        fill={open ? WHITE : 'transparent'}
        d={open ? 'M 5,4.5 l0, 4.5, l-4,0z' : 'M 1,4 l3.5,3, l-3.5, 3z'}
      />
    </svg>
  );
}
