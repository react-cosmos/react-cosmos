import React from 'react';
import { FixtureDecoratorId } from '../../../../utils/fixtureState/types';
import { ElRefs } from './shared';
import { useFixtureState } from './useFixtureState';
import { useReadClassState } from './useReadClassState';

export function useClassStateCapture(
  fixture: React.ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const elRefs = React.useRef<ElRefs>({});
  React.useEffect(() => {
    return () => {
      elRefs.current = {};
    };
  }, []);

  useReadClassState(fixture, decoratorId, elRefs);
  return useFixtureState(fixture, decoratorId, elRefs);
}
