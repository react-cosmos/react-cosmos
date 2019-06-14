import React from 'react';
import styled from 'styled-components';
import { ChevronRightIcon, ChevronDownIcon } from '../../icons';
import { ValueNode, TreeItemContainer } from './shared';

type Props = {
  node: ValueNode;
  parents: string[];
  isExpanded: boolean;
  onToggle: () => unknown;
};

export function ValueInputTreeDir({
  node,
  parents,
  isExpanded,
  onToggle
}: Props) {
  const dirName = parents[parents.length - 1];
  const childNames = getChildNames(node);
  const disabled = childNames.length === 0;
  return (
    <TreeItemContainer indentLevel={parents.length - 1}>
      <ButtonContainer>
        <Button disabled={disabled} onClick={onToggle}>
          <>
            <ChevronContainer disabled={disabled}>
              {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </ChevronContainer>
            <Text>
              <DirName disabled={disabled}>{dirName}</DirName>
              <ChildrenInfo>{getChildInfo(childNames)}</ChildrenInfo>
            </Text>
          </>
        </Button>
      </ButtonContainer>
    </TreeItemContainer>
  );
}

function getChildInfo(childNames: string[]): string {
  return childNames.length > 0 ? `{ ${childNames.join(', ')} }` : `{}`;
}

function getChildNames(node: ValueNode): string[] {
  const { dirs, items } = node;
  return [...Object.keys(dirs), ...Object.keys(items)];
}

const ButtonContainer = styled.div`
  padding: 2px 0;
`;

const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
  height: 24px;
  margin: 0 0 0 -5px;
  padding: 0 4px;
  border: none;
  border-radius: 3px;
  background: transparent;
  line-height: 24px;
  text-align: left;
  outline: none;
  white-space: nowrap;

  :focus {
    box-shadow: 0 0 0.5px 1px var(--primary4);
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const ChevronContainer = styled.span<{ disabled: boolean }>`
  --size: 16px;

  flex-shrink: 0;
  width: var(--size);
  height: var(--size);
  margin: 0 0 0 -3px;
  padding: 2px 2px 0 0;
  color: ${props => (props.disabled ? 'var(--grey3)' : 'var(--grey4)')};
`;

const Text = styled.span`
  color: var(--grey4);
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DirName = styled.span<{ disabled: boolean }>`
  color: ${props => (props.disabled ? 'var(--grey4)' : 'var(--grey7)')};
`;

const ChildrenInfo = styled.span`
  padding: 0 0 0 6px;
`;
