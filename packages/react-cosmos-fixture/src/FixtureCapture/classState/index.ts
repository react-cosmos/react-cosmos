import * as React from 'react';
import { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';
import { ElRefs, useUnmount } from './shared';
import { useFixtureState } from './useFixtureState';
import { useReadClassState } from './useReadClassState';

export function useClassStateCapture(
  children: React.ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const elRefs = React.useRef<ElRefs>({});
  useUnmount(() => {
    elRefs.current = {};
  });

  useReadClassState(children, decoratorId, elRefs);
  return useFixtureState(children, decoratorId, elRefs);
}
