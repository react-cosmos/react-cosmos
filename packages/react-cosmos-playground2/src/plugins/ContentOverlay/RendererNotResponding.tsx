import * as React from 'react';
import styled from 'styled-components';
import { ArtificialIntelligenceIllustration } from '../../shared/illustrations';
import { IllustrationContainer, Unbreakable } from './shared';

export function RendererNotResponding() {
  return (
    <Container>
      <Content>
        <Header>
          Renderer <Unbreakable>not responding</Unbreakable>
        </Header>
        <Paragraph>{`It's usually one of the following...`}</Paragraph>
        <List>
          <li>
            <No>1</No>
            <span>
              <strong>Please check your terminal for errors.</strong> Your build
              might be broken.
            </span>
          </li>
          <li>
            <No>2</No>
            <span>
              If you use a custom webpack config,{' '}
              <strong>
                make sure your build is generating an index.html page.
              </strong>
            </span>
          </li>
        </List>
        <Paragraph>
          <ActionLink
            href="https://join-react-cosmos.now.sh"
            rel="noopener noreferrer"
            target="_blank"
          >
            ask for help
          </ActionLink>
        </Paragraph>
      </Content>
      <IllustrationContainer>
        <ArtificialIntelligenceIllustration title="robot" />
      </IllustrationContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 512px;
  padding: 0 32px;
  font-size: 16px;
  line-height: 1.5em;
  color: var(--grey1);

  strong {
    font-weight: 500;
  }
`;

const Header = styled.h1`
  position: relative;
  margin: 0 0 64px 0;
  color: var(--primary3);
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.015em;

  ::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 64px;
    height: 3px;
    background: var(--primary3);
  }
`;

const Paragraph = styled.p`
  margin: 16px 0;
`;

const List = styled.ul`
  margin: 0 0 48px 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 12px;
  }
`;

const No = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  margin: 6px 16px 0 0;
  padding: 0 6px 0 0;
  border-radius: 100%;
  font-size: 18px;
  font-weight: 600;
  background: var(--grey5);
  color: var(--grey3);

  ::after {
    content: '.';
  }
`;

const ActionLink = styled.a`
  display: inline-block;
  --size: 36px;
  height: var(--size);
  padding: 0 16px;
  background: var(--primary4);
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  line-height: var(--size);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
`;
