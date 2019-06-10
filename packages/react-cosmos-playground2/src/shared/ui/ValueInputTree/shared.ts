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

export const TreeRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 28px;
  line-height: 28px;
`;
