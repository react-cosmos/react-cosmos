import React from 'react';
import {
  createValue,
  findFixtureStateCustomState,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { getCurrentValue, updateCustomState } from './shared';

export function useCreateOrResetFixtureState(
  inputName: string,
  defaultValue: FixtureStateValueType
) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    setFixtureState(prevFsState => {
      const fsValue = findFixtureStateCustomState(prevFsState, inputName);
      if (fsValue) {
        // TODO: didValueChange function
        // if (
        //   fsValue.type === 'primitive' &&
        //   defaultValue === fsValue.defaultValue
        // ) {
        //   return prevFsState;
        // }
        // if (
        //   (fsValue.type === 'object' || fsValue.type === 'array') &&
        //   isEqual(defaultValue, fsValue.defaultValues)
        // ) {
        //   return prevFsState;
        // }
        // throw new Error(
        //   `Cosmos.useState doesn't work with "${fsValue.type}" values`
        // );
      }

      return updateCustomState(prevFsState, customState => ({
        ...customState,
        [inputName]: {
          defaultValue: createValue(defaultValue),
          currentValue: createValue(
            getCurrentValue(prevFsState, inputName, defaultValue)
          )
        }
      }));
    });
  }, [setFixtureState, inputName, defaultValue]);
}
