import React from 'react';
import styled from 'styled-components';
import {
  slideInDelay,
  slideInOpacityDuration,
  slideInYDuration,
  slideInYOffset
} from './shared/ui';
import { useViewportEnter } from './shared/useViewportEnter';

export function Benefits() {
  const [ref, entered] = useViewportEnter(0.66);
  return (
    <Container ref={ref} id="benefits">
      <Benefit visible={entered} nth={0}>
        <Check visible={entered} nth={0} />
        <span>Prototype and iterate quickly</span>
      </Benefit>
      <Benefit visible={entered} nth={1}>
        <Check visible={entered} nth={1} />
        <span>Debug with ease</span>
      </Benefit>
      <Benefit visible={entered} nth={2}>
        <Check visible={entered} nth={2} />
        <span>Create reusable components</span>
      </Benefit>
      <Benefit visible={entered} nth={3}>
        <Check visible={entered} nth={3} />
        <span>Share UI across projects</span>
      </Benefit>
      <Benefit visible={entered} nth={4}>
        <Check visible={entered} nth={4} />
        <span>Publish component libraries</span>
      </Benefit>
      <Benefit visible={entered} nth={5}>
        <Check visible={entered} nth={5} emphasized={true} />
        <strong>Maintain quality at scale</strong>
      </Benefit>
    </Container>
  );
}

const Container = styled.div`
  max-width: 512px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

type BenefitProps = {
  children: React.ReactNode;
  visible: boolean;
  nth: number;
};

function Benefit({ children, visible, nth }: BenefitProps) {
  return (
    <StyledBenefit
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate(0, ${visible ? 0 : slideInYOffset}px)`,
        transitionDelay: visible ? `${nth * slideInDelay}s` : '0s'
      }}
    >
      {children}
    </StyledBenefit>
  );
}

const StyledBenefit = styled.div`
  margin: 0 0 32px 0;
  padding: 5px 20px 5px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 24px;
  line-height: 30px;
  transition: ${slideInOpacityDuration}s opacity, ${slideInYDuration}s transform;

  :last-child {
    margin-bottom: 0;
  }

  strong {
    font-weight: 500;
  }
`;

type CheckProps = {
  visible: boolean;
  nth: number;
  emphasized?: boolean;
};

function Check({ visible, nth, emphasized = false }: CheckProps) {
  const strokeDashoffset = visible ? 0 : 100;
  return (
    <StyledCheck style={{ opacity: emphasized ? 1 : 0.8 }}>
      <StyledCircleSvg>
        <StyledCircle
          cx="16"
          cy="16"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset={strokeDashoffset}
          style={{ transitionDelay: visible ? `${nth * slideInDelay}s` : '0s' }}
        />
      </StyledCircleSvg>
      <StyledCheckSvg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </StyledCheckSvg>
    </StyledCheck>
  );
}

const StyledCheck = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  margin: 0 16px 0 0;
`;

const StyledCircleSvg = styled.svg`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  transform: rotate(-90deg);
`;

const StyledCircle = styled.circle`
  transition: 1s stroke-dashoffset;
`;

const StyledCheckSvg = styled.svg`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 5px;
  left: 4px;
`;
