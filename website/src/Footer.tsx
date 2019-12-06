import React from 'react';
import styled from 'styled-components';
import { Center } from './shared/ui';

export function Footer() {
  return (
    <Container id="footer">
      <Center>
        <Title>Hi there!</Title>
        <Subtitle>
          <strong>I’m Ovidiu, a passionate developer from Romania.</strong>
          <br />
          Obsessed with details, I made React Cosmos for likeminded developers.
        </Subtitle>
        <TextBody>
          <Paragraph>
            The journey began in 2014 when I introduced React at Hootsuite,
            where I was an Engineering Manager at the time. With React, the need
            for a component-driven dev environment arose and gave birth to React
            Cosmos. Over the years, I carried React Cosmos across projects and
            teams, slowly morphing it into the well rounded project you’re
            looking at.
          </Paragraph>
          <Paragraph>
            I use React Cosmos as a blank canvas for new UI components. I use it
            to ensure reusability at scale. I use React Cosmos to build React
            Cosmos, and I used it to make this website. Most importantly, I get
            a warm fuzzy feeling when other people become more productive with
            React Cosmos.
          </Paragraph>
          <Paragraph>
            React Cosmos is licensed as MIT and will always be free. If you want
            to support me, however, become a Sponsor and ensure this journey
            continues!
          </Paragraph>
        </TextBody>
      </Center>
    </Container>
  );
}

const Container = styled.div`
  padding: 20vh 20px;
  background: #0a2e46;
  background: linear-gradient(#0a2e46, #093556);
  color: #b1dcfd;
`;

const TextBody = styled.div`
  max-width: 704px;
`;

const Title = styled.h3`
  margin: 0 0 32px 0;
  color: #4d9edc;
  font-size: 48px;
  font-weight: 500;
  line-height: 56px;
`;

const Subtitle = styled.p`
  margin: 0 0 32px 0;
  color: #dfeaf3;
  font-size: 24px;
  line-height: 38px;
  font-weight: 300;

  strong {
    font-weight: 500;
    color: #dfeaf3;
  }
`;

const Paragraph = styled.p`
  margin: 0 0 32px 0;
  font-size: 20px;
  font-weight: 400;
  line-height: 34px;
`;
