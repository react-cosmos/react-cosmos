import styled from 'styled-components';
import { minFeatureColumnsWidth } from '../Features/shared.js';
import { mobileMaxWidth } from './breakpoints.js';

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
