// @flow

import React from 'react';
import { FixtureCapture } from 'react-cosmos-fixture';

export default ({ children }: { children: React$Node }) => (
  <FixtureCapture decoratorId="bgDecorator">
    <BgDecorator backgroundColor="lightgrey">{children}</BgDecorator>
  </FixtureCapture>
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
