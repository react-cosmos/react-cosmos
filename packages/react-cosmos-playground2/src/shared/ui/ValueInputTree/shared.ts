import styled from 'styled-components';
import {
  FixtureStatePrimitiveValue,
  FixtureStateUnserializableValue
} from 'react-cosmos-shared2/fixtureState';
import { TreeNode } from '../TreeView';

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

function getLeftPadding(depth: number) {
  return depth * 16;
}
