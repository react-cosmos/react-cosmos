import React from 'react';
import styled from 'styled-components';
import { ChevronDownIcon, ChevronRightIcon } from '../../icons';
import { blue, disabledColors, grey128, grey160, grey224 } from '../colors';
import { TreeItemContainer, ValueNode } from './shared';

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
  onToggle,
}: Props) {
  const dirName = parents[parents.length - 1];
  const childNames = getChildNames(node);
  const disabled = childNames.length === 0;
  return (
    <TreeItemContainer indentLevel={parents.length - 1}>
      <ButtonContainer>
        <Button disabled={disabled} onClick={onToggle}>
          <>
            {!disabled && (
              <ChevronContainer>
                {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </ChevronContainer>
            )}
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
  margin: 0;
  padding: 0 4px;
  border: none;
  border-radius: 3px;
  background: transparent;
  font-size: 14px;
  line-height: 24px;
  text-align: left;
  outline: none;
  white-space: nowrap;

  :focus {
    box-shadow: 0 0 0.5px 1px ${blue};
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const iconSize = 16;

const ChevronContainer = styled.span`
  flex-shrink: 0;
  width: ${iconSize}px;
  height: ${iconSize}px;
  margin: 0 0 0 -2px;
  padding: 0px 2px 0 0;
  color: ${grey160};
`;

const Text = styled.span`
  color: ${grey128};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DirName = styled.span<{ disabled: boolean }>`
  color: ${disabledColors(grey224, grey128)};
  padding: 0 0 0 ${props => (props.disabled ? 16 : 0)}px;
`;

const ChildrenInfo = styled.span`
  padding: 0 0 0 6px;
`;
