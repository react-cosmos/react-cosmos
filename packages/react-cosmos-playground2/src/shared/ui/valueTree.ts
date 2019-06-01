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
    if (value.type === 'composite') {
      dirs[key] = getFixtureStateValueTree(value.values);
    } else {
      items[key] = value;
    }
  });

  return { items, dirs };
}
