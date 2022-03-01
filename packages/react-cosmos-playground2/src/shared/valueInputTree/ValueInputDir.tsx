import { blue } from 'chalk';
import React from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  disabledColors,
  grey128,
  grey160,
  grey224,
} from 'react-cosmos-shared2/ui';
import styled from 'styled-components';
import { ValueTreeItem } from './shared';

type Props = {
  name: string;
  childNames: string[];
  expanded: boolean;
  indentLevel: number;
  onToggle: () => unknown;
};

export function ValueInputDir({
  name,
  childNames,
  expanded,
  indentLevel,
  onToggle,
}: Props) {
  const disabled = childNames.length === 0;
  return (
    <ValueTreeItem indentLevel={indentLevel}>
      <ButtonContainer>
        <Button disabled={disabled} onClick={onToggle}>
          <>
            {!disabled && (
              <ChevronContainer>
                {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </ChevronContainer>
            )}
            <Text>
              <DirName disabled={disabled}>{name}</DirName>
              <ChildrenInfo>{getChildInfo(childNames)}</ChildrenInfo>
            </Text>
          </>
        </Button>
      </ButtonContainer>
    </ValueTreeItem>
  );
}

function getChildInfo(childNames: string[]): string {
  return childNames.length > 0 ? `{ ${childNames.join(', ')} }` : `{}`;
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
