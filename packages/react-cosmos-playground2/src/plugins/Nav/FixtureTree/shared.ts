import styled from 'styled-components';

type ListItemProps = {
  indentLevel: number;
  selected?: boolean;
};

export const ListItem = styled.span<ListItemProps>`
  --height: 28px;
  --hover-bg: hsl(var(--hue-primary), 19%, 21%);

  display: flex;
  flex-direction: row;
  align-items: center;
  height: var(--height);
  padding: 0 16px 0 ${props => getLeftPadding(props.indentLevel)}px;
  background: ${props => (props.selected ? 'var(--darkest)' : 'transparent')};
  color: ${props => (props.selected ? 'var(--grey6)' : 'var(--grey4)')};
  line-height: var(--height);
  user-select: none;
  cursor: default;
  transition: background var(--quick), color var(--quick);

  :hover {
    background: ${props =>
      props.selected ? 'var(--darkest)' : 'var(--hover-bg)'};
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
