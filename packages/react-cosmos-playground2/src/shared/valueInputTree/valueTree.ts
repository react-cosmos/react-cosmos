import { FixtureStateValues } from 'react-cosmos-shared2/fixtureState';
import { ValueNode } from './shared';

export function getFixtureStateValueTree(
  values: FixtureStateValues
): ValueNode {
  const children: Record<string, ValueNode> = {};

  Object.keys(values).forEach(key => {
    const value = values[key];
    if (value.type === 'object') {
      children[key] = getFixtureStateValueTree(value.values);
    } else if (value.type === 'array') {
      const objValues: FixtureStateValues = {};
      value.values.forEach((v, idx) => {
        objValues[idx] = v;
      });
      children[key] = getFixtureStateValueTree(objValues);
    } else {
      children[key] = { data: { type: 'item', value } };
    }
  });

  return { data: { type: 'collection' }, children };
}
