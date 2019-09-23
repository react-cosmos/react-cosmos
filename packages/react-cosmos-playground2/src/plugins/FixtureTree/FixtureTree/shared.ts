import styled from 'styled-components';
import {
  grey224,
  grey24,
  grey248,
  grey32,
  grey8,
  selectedColors
} from '../../../shared/ui/colors';

type ListItemProps = {
  indentLevel: number;
  selected?: boolean;
};

export const ListItem = styled.span<ListItemProps>`
  --height: 28px;

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--height);
  padding: 0 16px 0 ${props => getLeftPadding(props.indentLevel)}px;
  background: ${selectedColors(grey32, grey8)};
  color: ${selectedColors(grey224, grey248)};
  line-height: var(--height);
  user-select: none;
  cursor: default;
  transition: background var(--quick), color var(--quick);

  :hover {
    background: ${selectedColors(grey24, grey8)};
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
