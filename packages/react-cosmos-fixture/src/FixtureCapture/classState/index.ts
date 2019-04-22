import * as React from 'react';
import { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';
import { ElRefs, useUnmount } from './shared';
import { useFixtureState } from './useFixtureState';
import { useReadClassState } from './useReadClassState';

export function useClassStateCapture(
  fixture: React.ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const elRefs = React.useRef<ElRefs>({});
  useUnmount(() => {
    elRefs.current = {};
  });

  useReadClassState(fixture, decoratorId, elRefs);
  return useFixtureState(fixture, decoratorId, elRefs);
}
