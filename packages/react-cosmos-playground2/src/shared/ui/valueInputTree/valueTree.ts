import { FixtureStateValues } from 'react-cosmos-shared2/fixtureState';
import { TreeNodeDirs } from '../TreeView';
import { TreeItemValue, ValueNode } from './shared';

export type ValueNodeDirs = TreeNodeDirs<TreeItemValue>;

export function getFixtureStateValueTree(
  values: FixtureStateValues
): ValueNode {
  const items: Record<string, TreeItemValue> = {};
  const dirs: ValueNodeDirs = {};

  Object.keys(values).forEach(key => {
    const value = values[key];
    if (value.type === 'object') {
      dirs[key] = getFixtureStateValueTree(value.values);
    } else if (value.type === 'array') {
      const objValues: FixtureStateValues = {};
      value.values.forEach((v, idx) => {
        objValues[idx] = v;
      });
      dirs[key] = getFixtureStateValueTree(objValues);
    } else {
      items[key] = value;
    }
  });

  return { items, dirs };
}
