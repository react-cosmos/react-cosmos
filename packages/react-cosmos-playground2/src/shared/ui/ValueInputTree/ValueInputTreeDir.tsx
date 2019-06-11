import React from 'react';
import styled from 'styled-components';
import { ValueNode } from './shared';
import { ChevronRightIcon, ChevronDownIcon } from '../../icons';
import { TreeItemContainer } from './shared';

type Props = {
  node: ValueNode;
  parents: string[];
  isExpanded: boolean;
  onToggle: () => unknown;
};

// TODO: Focus state
export function ValueInputTreeDir({
  node,
  parents,
  isExpanded,
  onToggle
}: Props) {
  const dirName = parents[parents.length - 1];
  const childNames = getChildNames(node);
  return (
    <TreeItemContainer indentLevel={parents.length - 1}>
      <Button disabled={childNames.length === 0} onClick={onToggle}>
        <>
          <ChevronContainer>
            {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </ChevronContainer>
          <Text>
            {dirName}
            <ChildNames>
              {childNames.length > 0 ? `{ ${childNames.join(', ')} }` : `{}`}
            </ChildNames>
          </Text>
        </>
      </Button>
    </TreeItemContainer>
  );
}

function getChildNames(node: ValueNode): string[] {
  const { dirs, items } = node;
  return [...Object.keys(dirs), ...Object.keys(items)];
}

const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--grey4);
  line-height: 28px;
  text-align: left;
  outline: none;
  white-space: nowrap;
`;

const ChevronContainer = styled.span`
  --size: 16px;

  flex-shrink: 0;
  width: var(--size);
  height: var(--size);
  margin: 0 0 0 -2px;
  padding: 2px 2px 0 0;
`;

const Text = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChildNames = styled.span`
  padding: 0 0 0 6px;
  color: var(--grey5);
`;
