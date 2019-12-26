import React from 'react';
import styled from 'styled-components';
import {
  getSlideInStyle,
  slideInDelay,
  slideInTransition
} from './shared/slideIn';
import { useViewportEnter } from './shared/useViewportEnter';

export function Benefits() {
  const [ref1, entered1] = useViewportEnter(0.66);
  const [ref2, entered2] = useViewportEnter(0.66);
  return (
    <Container id="benefits">
      <Column ref={ref1}>
        <Benefit visible={entered1} nth={0}>
          <Check visible={entered1} nth={0} />
          <BenefitText>
            <BenefitTitle>Prototype and iterate quickly</BenefitTitle>
            <BenefitDescription>
              {`New components require your undivided attention.
              Minimize the feedback loop by zooming in on the feature you're building. Running unrelated code and reloading your whole app on every change is a waste of time.`}
            </BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered1} nth={1}>
          <Check visible={entered1} nth={1} />
          <BenefitText>
            <BenefitTitle>Debug with ease</BenefitTitle>
            <BenefitDescription>
              {`The complexity of user interfaces is overwhelming. It's hard to tell what went wrong with dozens of components affecting each other. You find the source of bugs much quicker when you isolate components.`}
            </BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered1} nth={2}>
          <Check visible={entered1} nth={2} />
          <BenefitText>
            <BenefitTitle>Create reusable components</BenefitTitle>
            <BenefitDescription>
              {`Why bother making standalone components? Because decoupled components lead to reusable code and a robust architecture, which saves you from having to rewrite your UI every other year.`}
            </BenefitDescription>
          </BenefitText>
        </Benefit>
      </Column>
      <Column ref={ref2}>
        <Benefit visible={entered2} nth={0}>
          <Check visible={entered2} nth={0} />
          <BenefitText>
            <BenefitTitle>Share UI across projects</BenefitTitle>
            <BenefitDescription>{`Reuse components across projects and teams to prevent duplicate efforts and inconsistencies within a suite of products. A shared set of UI primitives also amounts to a solid visual foundation for your brand.`}</BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered2} nth={1}>
          <Check visible={entered2} nth={1} />
          <BenefitText>
            <BenefitTitle>Publish component libraries</BenefitTitle>
            <BenefitDescription>{`A component library is the cornerstone of design systems. You can share component libraries inside your organization, or make them public, and bridge the gap between designers and developers.`}</BenefitDescription>
          </BenefitText>
        </Benefit>
        <Benefit visible={entered2} nth={2}>
          <Check visible={entered2} nth={2} />
          <BenefitText>
            <BenefitTitle>Maintain quality at scale</BenefitTitle>
            <BenefitDescription>{`Big projects are made out of small pieces. The quality of each unit, together with the clarity of their integration, dictate the overall success of the whole. Reusable components are the key to awesome user intefaces.`}</BenefitDescription>
          </BenefitText>
        </Benefit>
      </Column>
    </Container>
  );
}

const column = 640;
const maxWidthCheckIcon = column + 48;
const minColumnsWidth = column * 2 + 96;
const maxColumnsWidth = column * 2 + 256;

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${maxColumnsWidth}px;

  @media (min-width: ${minColumnsWidth}px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 32px 0;

  :last-child {
    margin-bottom: 0;
  }

  @media (min-width: ${minColumnsWidth}px) {
    margin-bottom: 0;
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
  max-width: ${column}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: ${slideInTransition};

  :last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${maxWidthCheckIcon}px) {
    padding: 0 20px;
  }

  @media (min-width: ${minColumnsWidth}px) {
    margin-bottom: 64px;
  }
`;

const BenefitText = styled.div`
  font-size: 22px;
  line-height: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
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
  const strokeDashoffset = visible ? 0 : 120;
  return (
    <StyledCheck>
      <StyledCircleSvg>
        <StyledCircle
          cx="20px"
          cy="20px"
          r="19px"
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
  width: 40px;
  height: 40px;
  margin: 0 24px 0 0;
  opacity: 0.9;

  @media (max-width: ${maxWidthCheckIcon}px) {
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
  width: 30px;
  height: 30px;
  top: 7px;
  left: 5px;
`;
