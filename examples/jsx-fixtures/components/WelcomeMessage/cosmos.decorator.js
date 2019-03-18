// @flow

import React from 'react';

export default ({ children }: { children: React$Node }) => (
  <BgDecorator backgroundColor="lightgrey">{children}</BgDecorator>
);

function BgDecorator({
  children,
  backgroundColor
}: {
  children: React$Node,
  backgroundColor: string
}) {
  return <div style={{ backgroundColor }}>{children}</div>;
}
