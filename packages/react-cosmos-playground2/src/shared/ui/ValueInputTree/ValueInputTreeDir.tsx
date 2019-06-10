import React from 'react';
import styled from 'styled-components';
import { ValueNode } from './shared';
import { ChevronRightIcon, ChevronDownIcon } from '../../icons';
import { DarkButton } from '../Button';
import { TreeItemContainer } from './shared';

type Props = {
  node: ValueNode;
  parents: string[];
  isExpanded: boolean;
  onToggle: () => unknown;
};

// TODO: Truncate child names on small widths
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
      <DarkButton
        icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        label={
          <>
            {dirName}
            <ChildNames>
              {childNames.length > 0 ? `{ ${childNames.join(', ')} }` : '{}'}
            </ChildNames>
          </>
        }
        disabled={childNames.length === 0}
        selected={isExpanded}
        onClick={onToggle}
      />
    </TreeItemContainer>
  );
}

function getChildNames(node: ValueNode): string[] {
  const { dirs, items } = node;
  return [...Object.keys(dirs), ...Object.keys(items)];
}

const ChildNames = styled.span`
  padding: 0 0 0 4px;
  color: var(--grey4);
`;
