import styled from 'styled-components';
import { minFeatureColumnsWidth } from '../Features/shared';
import { mobileMaxWidth } from './breakpoints';

export const Height = styled.div<{
  mobile: number;
  tablet: number;
  desktop: number;
}>`
  height: ${props => props.tablet}px;

  @media (max-width: ${mobileMaxWidth}px) {
    height: ${props => props.mobile}px;
  }

  @media (min-width: ${minFeatureColumnsWidth}px) {
    height: ${props => props.desktop}px;
  }
`;
