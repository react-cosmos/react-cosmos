import React from 'react';
import styled from 'styled-components';
import { columnsWidthBreakpoint, contentMaxWidth } from './shared/breakpoints';
import {
  getSlideInStyle,
  slideInDelay,
  slideInTransition
} from './shared/slideIn';
import { useViewportEnter } from './shared/useViewportEnter';

export function Benefits() {
  const [ref, entered] = useViewportEnter(0.66);
  return (
    <Container ref={ref} id="benefits">
      <RocketContainer
        style={{
          background: `rgba(10, 46, 70, ${entered ? 0.06 : 0})`,
          transitionDelay: entered ? '0.6s' : '0s'
        }}
      >
        <Rocket visible={entered} />
      </RocketContainer>
      <List>
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
          <Check visible={entered} nth={5} />
          <span>Maintain quality at scale</span>
        </Benefit>
      </List>
    </Container>
  );
}

const Container = styled.div`
  max-width: ${contentMaxWidth}px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: ${columnsWidthBreakpoint}px) {
    flex-direction: column-reverse;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RocketContainer = styled.div`
  flex-shrink: 0;
  margin: 0 64px 0 0;
  width: 192px;
  height: 192px;
  border-radius: 50%;
  transition: background 0.4s;
  overflow: hidden;
  /* https://stackoverflow.com/a/58283449/128816 */
  transform: translateZ(0);

  @media (max-width: ${columnsWidthBreakpoint}px) {
    margin-top: 64px;
    margin-right: 0;
  }
`;

type RocketProps = {
  visible: boolean;
};

function Rocket({ visible }: RocketProps) {
  const offset = visible ? 0 : 120;
  return (
    <StyledRocketSvg
      viewBox="0 0 24 24"
      style={{
        left: 46 - offset,
        top: 50 + offset,
        transitionDelay: visible ? '0.6s' : '0s'
      }}
    >
      <path d="M8.566 17.842c-.945 2.462-3.678 4.012-6.563 4.161.139-2.772 1.684-5.608 4.209-6.563l.51.521c-1.534 1.523-2.061 2.765-2.144 3.461.704-.085 2.006-.608 3.483-2.096l.505.516zm-1.136-11.342c-1.778-.01-4.062.911-5.766 2.614-.65.649-1.222 1.408-1.664 2.258 1.538-1.163 3.228-1.485 5.147-.408.566-1.494 1.32-3.014 2.283-4.464zm5.204 17.5c.852-.44 1.61-1.013 2.261-1.664 1.708-1.706 2.622-4.001 2.604-5.782-1.575 1.03-3.125 1.772-4.466 2.296 1.077 1.92.764 3.614-.399 5.15zm11.312-23.956c-.428-.03-.848-.044-1.261-.044-9.338 0-14.465 7.426-16.101 13.009l4.428 4.428c5.78-1.855 12.988-6.777 12.988-15.993v-.059c-.002-.437-.019-.884-.054-1.341zm-5.946 7.956c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
    </StyledRocketSvg>
  );
}

const StyledRocketSvg = styled.svg`
  position: relative;
  width: 100px;
  height: 100px;
  fill: currentColor;
  animation: hover 0.6s infinite ease;
  transition: left, 0.4s ease-out, bottom 0.4s ease-out;

  @keyframes hover {
    0% {
      transform: translateY(-0.6px) translateX(-0.6px);
    }
    25% {
      transform: translateX(0.6px) translateY(0.6px);
    }
    50% {
      transform: translateX(-0.6px) translateY(0.6px);
    }
    75% {
      transform: translateX(0.6px) translateY(-0.6px);
    }
    100% {
      transform: translateY(-0.6px) translateX(-0.6px);
    }
  }
`;

type BenefitProps = {
  children: React.ReactNode;
  visible: boolean;
  nth: number;
};

function Benefit({ children, visible, nth }: BenefitProps) {
  return (
    <StyledBenefit style={getSlideInStyle(visible, nth)}>
      {children}
    </StyledBenefit>
  );
}

const StyledBenefit = styled.div`
  margin: 0 0 32px 0;
  padding: 5px 24px 0 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 24px;
  line-height: 28px;
  letter-spacing: -0.02em;
  transition: ${slideInTransition};

  :last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${columnsWidthBreakpoint}px) {
    margin-bottom: 24px;
  }
`;

type CheckProps = {
  visible: boolean;
  nth: number;
};

function Check({ visible, nth }: CheckProps) {
  const strokeDashoffset = visible ? 0 : 100;
  return (
    <StyledCheck>
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
  opacity: 0.9;

  @media (max-width: ${columnsWidthBreakpoint}px) {
    margin-right: 12px;
  }
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
