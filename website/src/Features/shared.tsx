import styled from 'styled-components';
import { mobileMaxWidth } from '../shared/breakpoints';
import { slideInTransition } from '../shared/slideIn';

export const minFeatureColumnsWidth = 1280 + 96;
export const maxFeatureColumnsWidth = 1280 + 128;

export const Feature = styled.div`
  margin: 0 0 48px 0;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: ${slideInTransition};

  :last-child {
    margin-bottom: 0;
  }

  @media (min-width: ${minFeatureColumnsWidth}px) {
    max-width: 440px;
    margin-bottom: 0;
  }
`;

export const FeatureIconContainer = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  margin: 0 8px 16px 16px;
  background: rgba(10, 46, 70, 0.08);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.9;
  }

  @media (max-width: ${mobileMaxWidth}px) {
    width: 60px;
    height: 60px;
    margin: 0 6px 12px 12px;

    svg {
      width: 30px;
      height: 30px;
    }
  }
`;

export const FeatureTitle = styled.h2`
  margin: 0;
  padding: 0 20px 8px 20px;
  font-size: 32px;
  line-height: 1em;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-align: center;

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 26px;
  }
`;

export const FeatureDescription = styled.div`
  max-width: 640px;
  padding: 0 20px 0 20px;
  font-size: 22px;
  line-height: 1.3em;
  opacity: 0.85;
  text-align: center;

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 18px;
  }
`;
