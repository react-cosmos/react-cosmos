import * as React from 'react';
import { ElRefs, InitialStates } from './shared';

export function useCleanup(
  elRefs: React.MutableRefObject<ElRefs>,
  initialStates: React.MutableRefObject<InitialStates>
) {
  React.useEffect(
    () => () => {
      // Take out the trash
      elRefs.current = {};
      initialStates.current = {};
      // deleteRefHandlers(this);
    },
    []
  );
}
