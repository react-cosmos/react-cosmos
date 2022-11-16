import React from 'react';
import {
  FixtureLoader,
  ReactDecorators,
  ReactFixtureWrappers,
} from 'react-cosmos-core';
import { ErrorCatch } from './ErrorCatch.js';
import { renderDomMessage } from './renderDomMessage.js';
import { domRendererConnect } from './domRendererConnect.js';
import { domRendererId } from './domRendererId.js';
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
