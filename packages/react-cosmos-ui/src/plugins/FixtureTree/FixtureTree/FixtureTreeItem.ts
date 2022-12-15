import styled from 'styled-components';
import {
  grey224,
  grey24,
  grey248,
  grey32,
  grey8,
  selectedColors,
} from '../../../style/colors.js';
import { quick } from '../../../style/vars.js';

const itemHeight = 28;

type Props = {
  indentLevel: number;
  selected?: boolean;
};

export const FixtureTreeItem = styled.span<Props>`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${itemHeight}px;
  padding: 0 0 0 ${props => getLeftPadding(props.indentLevel)}px;
  background: ${selectedColors(grey32, grey8)};
  color: ${selectedColors(grey224, grey248)};
  line-height: ${itemHeight}px;
  user-select: none;
  cursor: default;
  transition: color ${quick}s;

  :hover {
    background: ${selectedColors(grey24, grey8)};
  }
`;

function getLeftPadding(depth: number) {
  return 8 + depth * 12;
}
