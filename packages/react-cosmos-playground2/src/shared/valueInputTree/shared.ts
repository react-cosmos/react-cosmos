import {
  FixtureElementId,
  FixtureStatePrimitiveValue,
  FixtureStateUnserializableValue,
} from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { TreeNode } from 'react-cosmos-shared2/util';
import styled from 'styled-components';

export type LeafValue =
  | FixtureStatePrimitiveValue
  | FixtureStateUnserializableValue;

export type ValueNodeData =
  | { type: 'collection' }
  | { type: 'item'; value: LeafValue };

export type ValueNode = TreeNode<ValueNodeData>;

type TreeItemContainerProps = {
  indentLevel: number;
};

export const TreeItemContainer = styled.div<TreeItemContainerProps>`
  padding: 0 0 0 ${props => getLeftPadding(props.indentLevel)}px;
`;

export function stringifyElementId(elementId: FixtureElementId) {
  const { decoratorId, elPath } = elementId;
  return elPath ? `${decoratorId}-${elPath}` : decoratorId;
}

export function stringifyFixtureId(fixtureId: FixtureId) {
  const { path, name } = fixtureId;
  return name ? `${path}-${name}` : path;
}

function getLeftPadding(depth: number) {
  return depth * 12;
}
