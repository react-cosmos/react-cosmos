import styled from 'styled-components';
import { blue } from '../../../core/colors';
import { quick } from '../../../core/vars';

type StyledButtonProps = {
  bg: string;
  bgSelect: string;
  bgHover: string;
  color: string;
  colorSelect: string;
  selected: boolean;
  disabled: boolean;
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 8px;
  height: 32px;
  border: 0;
  border-radius: 3px;
  background: ${props => (props.selected ? props.bgSelect : props.bg)};
  color: ${props => (props.selected ? props.colorSelect : props.color)};
  white-space: nowrap;
  user-select: none;
  outline: none;
  transition: background ${quick}s, color ${quick}s, opacity ${quick}s;

  :hover {
    background: ${props => (props.selected ? props.bgSelect : props.bgHover)};
  }

  :focus {
    box-shadow: 0 0 0.5px 1px ${blue};
  }

  :disabled {
    background: ${props => (props.selected ? props.bgSelect : props.bg)};
    cursor: default;
    opacity: 0.5;
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

const iconSize = 16;

export const StyledIcon = styled.span<{ color: string }>`
  width: ${iconSize}px;
  height: ${iconSize}px;
  padding: 2px 0 0 0;
  color: ${props => props.color};
  transition: color ${quick}s;
`;

export const Label = styled.span`
  padding-left: 6px;
  line-height: 14px;

  :first-child {
    padding-left: 0;
  }
`;
