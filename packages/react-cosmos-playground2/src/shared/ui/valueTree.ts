import { TreeNode, TreeNodeDirs } from './TreeView';
import {
  FixtureStatePrimitiveValue,
  FixtureStateUnserializableValue,
  FixtureStateValues
} from 'react-cosmos-shared2/fixtureState';

type ItemValue = FixtureStatePrimitiveValue | FixtureStateUnserializableValue;

export type ValueNode = TreeNode<ItemValue>;
export type ValueNodeDirs = TreeNodeDirs<ItemValue>;

export function getFixtureStateValueTree(
  values: FixtureStateValues
): ValueNode {
  const items: Record<string, ItemValue> = {};
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
