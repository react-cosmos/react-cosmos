import React from 'react';
import {
  FixtureLoader,
  ReactDecorators,
  ReactFixtureWrappers,
} from 'react-cosmos-core';
import { domRendererConnect } from './domRendererConnect.js';
import { domRendererId } from './domRendererId.js';
import { ErrorCatch } from './ErrorCatch.js';
import { selectedFixtureId } from './selectedFixtureId.js';

type Props = {
  fixtures: ReactFixtureWrappers;
  decorators: ReactDecorators;
  onErrorReset?: () => unknown;
};
export function DomFixtureLoader({
  fixtures,
  decorators,
  onErrorReset,
}: Props) {
  return (
    <FixtureLoader
      rendererId={domRendererId}
      rendererConnect={domRendererConnect}
      fixtures={fixtures}
      selectedFixtureId={selectedFixtureId}
      systemDecorators={[ErrorCatch]}
      userDecorators={decorators}
      renderMessage={renderDomMessage}
      onErrorReset={onErrorReset}
    />
  );
}

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Ubuntu, "Helvetica Neue", Helvetica, sans-serif',
  fontSize: 14,
};

export function renderDomMessage({ msg }: { msg: string }) {
  return <div style={containerStyle}>{msg}</div>;
}
