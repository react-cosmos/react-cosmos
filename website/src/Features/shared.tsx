import styled from 'styled-components';
import { SlideIn } from '../shared/ui';

export const Feature = styled(SlideIn)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 10vh;

  :last-child {
    margin-bottom: 0;
  }

  @media (max-width: 791px) {
    text-align: center;
  }
`;

export const FeatureIconContainer = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  margin: 0 8px 0 16px;
  background: rgba(10, 46, 70, 0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.9;
  }
`;

export const FeatureTitle = styled.h2`
  margin: 0;
  padding: 32px 24px 8px 24px;
  font-size: 36px;
  line-height: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

export const FeatureDescription = styled.div`
  max-width: 640px;
  padding: 0 24px 32px 24px;
  font-size: 24px;
  line-height: 30px;
  opacity: 0.9;
`;
