import React, { ReactNode } from 'react';

export default ({ children }: { children: ReactNode }) => (
  <div
    style={{
      border: '2px dashed #AAA',
      padding: '0 16px',
      borderRadius: 8,
    }}
  >
    {children}
  </div>
);
