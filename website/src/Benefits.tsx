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
          background: `rgba(10, 46, 70, ${entered ? 0.06 : 0})`
        }}
      >
        <Rocket visible={entered} />
      </RocketContainer>
      <List>
        <Benefit visible={entered} nth={1}>
          <Check visible={entered} nth={1} />
          <BenefitText>
            <BenefitTitle>Prototype and iterate quickly</BenefitTitle>
            <BenefitDescription>
              {`New components require your undivided attention.
              Minimize the feedback loop by zooming in on the feature you're building. Running unrelated code and reloading your whole app on every change is a waste of time.`}
            </BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered} nth={2}>
          <Check visible={entered} nth={2} />
          <BenefitText>
            <BenefitTitle>Debug with ease</BenefitTitle>
            <BenefitDescription>
              {`The complexity of user interfaces is overwhelming. It's hard to tell what went wrong with dozens of components affecting each other. You find the source of bugs much quicker when you isolate components.`}
            </BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered} nth={3}>
          <Check visible={entered} nth={3} />
          <BenefitText>
            <BenefitTitle>Create reusable components</BenefitTitle>
            <BenefitDescription>
              {`Why bother making standalone components? Because decoupled components lead to reusable code and a robust architecture, which saves you from having to rewrite your UI every other year.`}
            </BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered} nth={4}>
          <Check visible={entered} nth={4} />
          <BenefitText>
            <BenefitTitle>Share UI across projects</BenefitTitle>
            <BenefitDescription>{`Reuse components across projects and teams to prevent duplicate efforts and inconsistencies within a suite of products. A shared set of UI primitives also amounts to a solid visual foundation for your brand.`}</BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered} nth={5}>
          <Check visible={entered} nth={5} />
          <BenefitText>
            <BenefitTitle>Publish component libraries</BenefitTitle>
            <BenefitDescription>{`A component library is the cornerstone of design systems. You can share component libraries inside your organization, or make them public, and bridge the gap between designers and developers.`}</BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered} nth={6}>
          <Check visible={entered} nth={6} />
          <BenefitText>
            <BenefitTitle>Maintain quality at scale</BenefitTitle>
            <BenefitDescription>{`Big projects are made out of small pieces. The quality of each unit, together with the clarity of their integration, dictates the overall success of the whole. Reusable components are the key to awesome user intefaces.`}</BenefitDescription>
          </BenefitText>
        </Benefit>
      </List>
    </Container>
  );
}

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RocketContainer = styled.div`
  flex-shrink: 0;
  margin: 0 0 64px 0;
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
        top: 50 + offset
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
  margin: 0 0 48px 0;
  padding: 5px 24px 0 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: ${slideInTransition};

  :last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${columnsWidthBreakpoint}px) {
    margin-bottom: 24px;
  }
`;

const BenefitText = styled.div`
  max-width: 640px;
  font-size: 24px;
  line-height: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  @media (max-width: ${columnsWidthBreakpoint}px) {
    font-size: 22px;
    line-height: 28px;
  }
`;

const BenefitTitle = styled.div`
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const BenefitDescription = styled.div`
  margin-top: 4px;
  letter-spacing: -0.02em;
  opacity: 0.8;
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
          cx="1em"
          cy="1em"
          r="calc(1em - 1px)"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="120"
          strokeDashoffset={strokeDashoffset}
          style={{ transitionDelay: visible ? `${nth * slideInDelay}s` : '0s' }}
        />
      </StyledCircleSvg>
      <StyledCheckSvg
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
  flex-shrink: 0;
  position: relative;
  width: 2em;
  height: 2em;
  margin: 0 24px 0 0;
  font-size: 20px;
  opacity: 0.9;

  @media (max-width: ${columnsWidthBreakpoint}px) {
    display: none;
  }
`;

const StyledCircleSvg = styled.svg`
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const StyledCircle = styled.circle`
  transition: 1s stroke-dashoffset;
`;

const StyledCheckSvg = styled.svg`
  position: absolute;
  width: 1.5em;
  height: 1.5em;
  top: 0.35em;
  left: 0.25em;
`;
