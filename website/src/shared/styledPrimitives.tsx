import styled from 'styled-components';
import { contentMaxWidth } from './breakpoints';

export const Center = styled.div`
  max-width: ${contentMaxWidth}px;
  margin: 0 auto;
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;
