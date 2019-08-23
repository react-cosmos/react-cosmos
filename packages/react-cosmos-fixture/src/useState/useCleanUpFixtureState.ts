import { omit } from 'lodash';
import React from 'react';
import { FixtureContext } from '../FixtureContext';
import { updateCustomState } from './shared';

export function useCleanUpFixtureState(inputName: string) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(
    () => () => {
      setFixtureState(prevFsState =>
        updateCustomState(prevFsState, customState =>
          omit(customState, inputName)
        )
      );
    },
    [setFixtureState, inputName]
  );
}
