import React from 'react';
import {
  createValues,
  findFixtureStateCustomState,
  FixtureStateValueGroup,
  FixtureStateValueType,
  isObject,
  isPrimitiveValue
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

      return updateCustomState(prevFsState, customState => {
        if (isPrimitiveValue(defaultValue)) {
          return {
            ...customState,
            [inputName]: {
              defaultValue: {
                type: 'primitive',
                value: defaultValue
              },
              currentValue: {
                type: 'primitive',
                value: getCurrentValue(prevFsState, inputName, defaultValue)
              }
            }
          };
        }

        if (isObject(defaultValue)) {
          const fsValueGroup: FixtureStateValueGroup = {
            defaultValue: {
              type: 'object',
              values: createValues(defaultValue)
            },
            currentValue: {
              type: 'object',
              values: createValues(
                getCurrentValue(prevFsState, inputName, defaultValue)
              )
            }
          };

          return {
            ...customState,
            [inputName]: fsValueGroup
          };
        }

        return customState;
      });
    });
  }, [setFixtureState, inputName, defaultValue]);
}
