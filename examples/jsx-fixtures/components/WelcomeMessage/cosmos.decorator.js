import React from 'react';

export default ({ children }) => (
  <BgDecorator backgroundColor="lightgrey">{children}</BgDecorator>
);

function BgDecorator({ children, backgroundColor }) {
  return <div style={{ backgroundColor }}>{children}</div>;
}
