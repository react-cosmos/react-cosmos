import React from 'react';

export default function DefaultFileIcon() {
  return (
    <div
      style={{
        backgroundColor: 'rgb(243, 204, 0)',
        position: 'relative',
        fontSize: '9px',
        color: '#333333',
        width: '16px',
        height: '16px',
        left: '1px'
      }}
    >
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          right: 1
        }}
      >
        JS
      </span>
    </div>
  );
}
