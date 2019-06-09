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

export const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 8px 0;
`;
