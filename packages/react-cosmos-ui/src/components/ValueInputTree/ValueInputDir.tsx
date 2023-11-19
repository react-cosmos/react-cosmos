import React from 'react';
import styled from 'styled-components';
import {
  blue,
  disabledColors,
  grey128,
  grey160,
  grey224,
} from '../../style/colors.js';
import { ChevronDownIcon, ChevronRightIcon } from '../icons/index.js';
import { ValueTreeItem } from './shared.js';

type Props = {
  name: string;
  childrenText: string;
  disabled: boolean;
  expanded: boolean;
  indentLevel: number;
  onToggle: () => unknown;
};

export function ValueInputDir({
  name,
  childrenText,
  disabled,
  expanded,
  indentLevel,
  onToggle,
}: Props) {
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
              <ChildrenInfo>{childrenText}</ChildrenInfo>
            </Text>
          </>
        </Button>
      </ButtonContainer>
    </ValueTreeItem>
  );
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
