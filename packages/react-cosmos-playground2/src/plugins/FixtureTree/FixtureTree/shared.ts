import styled from 'styled-components';
import {
  grey216,
  grey248,
  grey32,
  grey48,
  grey8,
  selectedColors
} from '../../../shared/ui/colors';

type ListItemProps = {
  indentLevel: number;
  selected?: boolean;
};

const colors = {
  bg: grey32,
  bgSelected: grey8,
  bgHover: grey48,
  color: grey216,
  colorSelected: grey248
};

export const ListItem = styled.span<ListItemProps>`
  --height: 28px;

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--height);
  padding: 0 16px 0 ${props => getLeftPadding(props.indentLevel)}px;
  background: ${selectedColors(colors.bg, colors.bgSelected)};
  color: ${selectedColors(colors.color, colors.colorSelected)};
  line-height: var(--height);
  user-select: none;
  cursor: default;
  transition: background var(--quick), color var(--quick);

  :hover {
    background: ${selectedColors(colors.bgHover, colors.bgSelected)};
  }
`;

export const Unshirinkable = styled.span`
  flex-shrink: 0;
`;

export const Label = styled(Unshirinkable)`
  white-space: nowrap;
`;

function getLeftPadding(depth: number) {
  return 8 + depth * 16;
}
