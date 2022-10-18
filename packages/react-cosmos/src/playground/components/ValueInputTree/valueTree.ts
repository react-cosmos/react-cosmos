import { FixtureStateValues } from 'react-cosmos-core/fixtureState';
import { ValueNode } from './shared';

export function createValueTree(values: FixtureStateValues): ValueNode {
  const children: Record<string, ValueNode> = {};

  Object.keys(values).forEach(key => {
    const value = values[key];
    if (value.type === 'object') {
      children[key] = createValueTree(value.values);
    } else if (value.type === 'array') {
      const objValues: FixtureStateValues = {};
      value.values.forEach((v, idx) => {
        objValues[idx] = v;
      });
      children[key] = createValueTree(objValues);
    } else {
      children[key] = { data: { type: 'item', value } };
    }
  });

  return { data: { type: 'collection' }, children };
}
