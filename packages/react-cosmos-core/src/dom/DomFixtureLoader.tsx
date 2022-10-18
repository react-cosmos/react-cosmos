import React from 'react';
import { ReactDecorators, ReactFixtureWrappers } from '../react/types.js';
import { FixtureLoader } from '../renderer/FixtureLoader/FixtureLoader.js';
import { ErrorCatch } from './ErrorCatch.js';
import { renderDomMessage } from './renderDomMessage.js';
import { rendererConnect } from './rendererConnect.js';
import { rendererId } from './rendererId.js';
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
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      fixtures={fixtures}
      selectedFixtureId={selectedFixtureId}
      systemDecorators={[ErrorCatch]}
      userDecorators={decorators}
      renderMessage={renderDomMessage}
      onErrorReset={onErrorReset}
    />
  );
}
