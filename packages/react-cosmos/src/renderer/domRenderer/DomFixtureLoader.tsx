import React from 'react';
import { ReactDecorators, ReactFixtureWrappers } from '../../utils/react/types';
import { FixtureLoader } from '../FixtureLoader/FixtureLoader';
import { ErrorCatch } from './ErrorCatch';
import { renderDomMessage } from './renderDomMessage';
import { rendererConnect } from './rendererConnect';
import { rendererId } from './rendererId';
import { selectedFixtureId } from './selectedFixtureId';

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
