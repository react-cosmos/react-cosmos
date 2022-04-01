import styled from 'styled-components';
import {
  FixtureElementId,
  FixtureStatePrimitiveValue,
  FixtureStateUnserializableValue,
} from '../../../core/fixtureState/types';
import { FixtureId } from '../../../renderer/types';
import { TreeNode } from '../../../utils/tree';

export type LeafValue =
  | FixtureStatePrimitiveValue
  | FixtureStateUnserializableValue;

export type ValueNodeData =
  | { type: 'collection' }
  | { type: 'item'; value: LeafValue };

export type ValueNode = TreeNode<ValueNodeData>;

type ValueTreeItemProps = {
  indentLevel: number;
};

export const ValueTreeItem = styled.div<ValueTreeItemProps>`
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
