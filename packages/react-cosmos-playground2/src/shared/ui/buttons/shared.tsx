import styled from 'styled-components';
import {
  blue,
  grey160,
  grey224,
  grey24,
  grey248,
  grey32,
  grey8,
  selectedColors
} from '../colors';

type StyledButtonProps = {
  selected: boolean;
  disabled: boolean;
};

const StyledButton = styled.button<StyledButtonProps>`
  --selected-bg: var(--grey5);
  --hover-bg: hsl(var(--hue-primary), 25%, 95%);

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 8px;
  min-height: 32px;
  border: 0;
  border-radius: 3px;
  background: ${props =>
    props.selected ? 'var(--selected-bg)' : 'transparent'};
  color: ${props => (props.selected ? 'var(--grey1)' : 'var(--grey2)')};
  white-space: nowrap;
  user-select: none;
  outline: none;
  transition: background var(--quick), color var(--quick), opacity var(--quick);

  :hover {
    background: ${props =>
      props.selected ? 'var(--selected-bg)' : 'var(--hover-bg)'};
  }

  :focus {
    box-shadow: 0 0 1px 1px var(--primary4);
  }

  :disabled {
    background: ${props =>
      props.selected ? 'var(--selected-bg)' : 'transparent'};
    cursor: default;
    opacity: 0.5;
  }

  ::-moz-focus-inner {
    border: 0;
  }
`;

export const DarkStyledButton = styled(StyledButton)`
  --selected-bg: ${grey8};
  --hover-bg: ${grey24};

  background: ${selectedColors(grey32, grey8)};
  color: ${selectedColors(grey224, grey248)};

  :hover {
    background: ${selectedColors(grey24, grey8)};
  }

  :focus {
    box-shadow: 0 0 0.5px 1px ${blue};
  }

  :disabled {
    background: ${props =>
      props.selected ? 'var(--selected-bg)' : 'transparent'};
  }
`;

const Icon = styled.span`
  --size: 16px;
  width: var(--size);
  height: var(--size);
  padding: 2px 0 0 0;
  color: var(--grey3);
`;

export const DarkIcon = styled(Icon)`
  color: ${grey160};
`;

export const Label = styled.span`
  padding-left: 6px;
  line-height: 14px;

  :first-child {
    padding-left: 0;
  }
`;
