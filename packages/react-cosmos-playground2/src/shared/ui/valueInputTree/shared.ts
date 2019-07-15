import {
  FixtureElementId,
  FixtureStatePrimitiveValue,
  FixtureStateUnserializableValue
} from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import { TreeNode } from '../../tree';

export type TreeItemValue =
  | FixtureStatePrimitiveValue
  | FixtureStateUnserializableValue;

export type ValueNode = TreeNode<TreeItemValue>;

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
  return depth * 16;
}
