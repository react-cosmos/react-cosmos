import React from 'react';
import styled from 'styled-components';
import { mobileMaxWidth } from './shared/breakpoints';
import { ExternalLink } from './shared/ExternalLink';
import { getSlideInStyle, slideInTransition } from './shared/slideIn';
import { Center } from './shared/styledPrimitives';
import { useViewportEnter } from './shared/useViewportEnter';

export function About() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <Container id="about">
      <Center ref={ref}>
        <Title style={getSlideInStyle(entered, 0)}>Hi there!</Title>
        <Subtitle style={getSlideInStyle(entered, 1)}>
          <strong>I’m Ovidiu, a passionate developer from Romania.</strong>
          <br />
          Obsessed with details, I made React Cosmos for like-minded developers.
        </Subtitle>
        <Story style={getSlideInStyle(entered, 2)}>
          <StoryBody>
            <Paragraph>
              The journey began in 2014 when I introduced React at Hootsuite,
              where I was an Engineering Manager at the time. A component-driven
              dev environment was the next natural step, and thus React Cosmos
              was born. Over the years, I carried React Cosmos across projects
              and teams, slowly morphing it into the well rounded project you’re
              looking at.
            </Paragraph>
            <Paragraph>
              I use React Cosmos as a blank canvas for new UI components. I use
              it to ensure reusability at scale. I use React Cosmos to build
              React Cosmos, and I used it to make this website. Above all, I get
              a warm fuzzy feeling when other people become more productive with
              React Cosmos.
            </Paragraph>
            <Paragraph>
              React Cosmos is licensed as MIT and will always be free. If you
              want to support me, become a Sponsor and ensure this journey
              continues!
            </Paragraph>
          </StoryBody>
          <CtaContainer>
            <CallToAction href="https://github.com/sponsors/skidding">
              <Heart />
              Become a Sponsor
            </CallToAction>
          </CtaContainer>
        </Story>
      </Center>
    </Container>
  );
}

const Container = styled.div`
  padding: 192px 20px 64px 20px;
  background: #0a2e46;
  background: linear-gradient(#0a2e46, #093556);
  color: #b1dcfd;

  @media (max-width: ${mobileMaxWidth}px) {
    padding-top: 128px;
  }
`;

const Title = styled.div`
  color: #dfeaf3;
  margin: 0 0 32px 0;
  font-size: 48px;
  line-height: 56px;
  transition: ${slideInTransition};

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 40px;
    line-height: 46px;
  }
`;

const Subtitle = styled.div`
  margin: 0 0 32px 0;
  color: #dfeaf3;
  font-size: 24px;
  font-weight: 300;
  line-height: 1.7em;
  transition: ${slideInTransition};

  strong {
    font-weight: 500;
  }

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 20px;
    font-weight: 400;
  }
`;

const Story = styled.div`
  transition: ${slideInTransition};
`;

const StoryBody = styled.div`
  max-width: 704px;
`;

const Paragraph = styled.p`
  margin: 0 0 32px 0;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.7em;

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 18px;
  }
`;

const CtaContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const CallToAction = styled(ExternalLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 28px;
  border-radius: 5px;
  background: #b1dcfd;
  color: #0a2e46;
  font-size: 28px;
  font-weight: 500;
  line-height: 64px;
  text-decoration: none;
  white-space: nowrap;

  svg {
    width: 26px;
    height: 26px;
    margin: 0 8px -2px -2px;
    stroke: #0a2e46;
    stroke-width: 2px;
    fill: none;
  }

  @media (max-width: ${mobileMaxWidth}px) {
    border-radius: 3px;
    padding: 0 22px;
    font-size: 22px;
    line-height: 50px;

    svg {
      width: 20px;
      height: 20px;
      margin: 0 6px -2px -2px;
    }
  }
`;

function Heart() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
