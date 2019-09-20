import styled from 'styled-components';
import { createGreyColor, selectableColors } from '../../../shared/ui/colors';

type ListItemProps = {
  indentLevel: number;
  selected?: boolean;
};

const colors = {
  bg: createGreyColor(32),
  bgSelected: createGreyColor(8),
  bgHover: createGreyColor(48),
  color: createGreyColor(216),
  colorSelected: createGreyColor(248)
};

export const ListItem = styled.span<ListItemProps>`
  --height: 28px;

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--height);
  padding: 0 16px 0 ${props => getLeftPadding(props.indentLevel)}px;
  background: ${selectableColors(colors.bg, colors.bgSelected)};
  color: ${selectableColors(colors.color, colors.colorSelected)};
  line-height: var(--height);
  user-select: none;
  cursor: default;
  transition: background var(--quick), color var(--quick);

  :hover {
    background: ${selectableColors(colors.bgHover, colors.bgSelected)};
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
