import * as React from 'react';
import { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';
import { ElRefs, InitialStates } from './shared';
import { useFixtureState } from './useFixtureState';
import { useReadClassState } from './useReadClassState';
import { useCleanup } from './useCleanup';

export function useClassStateCapture(
  children: React.ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const elRefs = React.useRef<ElRefs>({});
  // Remember initial state of child components to use as a default when
  // resetting fixture state
  const initialStates = React.useRef<InitialStates>({});

  useReadClassState(children, decoratorId, elRefs);
  useCleanup(elRefs, initialStates);

  return useFixtureState(children, decoratorId, elRefs, initialStates);
}
