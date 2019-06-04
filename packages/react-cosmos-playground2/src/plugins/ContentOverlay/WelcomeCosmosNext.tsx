import React from 'react';
import styled from 'styled-components';
import { AstronautIllustration } from '../../shared/illustrations';
import {
  ContentContainer,
  TextContainer,
  IllustrationContainer,
  NoWrap
} from './shared';

export function WelcomeCosmosNext() {
  return (
    <ContentContainer>
      <TextContainer>
        <Header>
          Welcome to <NoWrap>Cosmos Next</NoWrap>
        </Header>
        <List>
          <li>
            <Bullet />
            <span>
              New to Cosmos or a long time user, make sure to
              <br />
              <Link
                href="https://github.com/react-cosmos/react-cosmos/blob/master/NEXT.md"
                rel="noopener noreferrer"
                target="_blank"
              >
                <strong>check out the docs on getting started</strong>
              </Link>
              .
            </span>
          </li>
          <li>
            <Bullet />
            <span>
              {`It's`} still early days, but with your help Cosmos Next will
              become <em>the</em> dev platform for React developers!
            </span>
          </li>
        </List>
        <Paragraph>
          <ActionLink
            href="https://join-react-cosmos.now.sh"
            rel="noopener noreferrer"
            target="_blank"
          >
            share your feedback
          </ActionLink>
        </Paragraph>
        <Footnote>PS. The stable version isn’t going anywhere</Footnote>
      </TextContainer>
      <IllustrationContainer>
        <AstronautIllustration title="astronaut" />
      </IllustrationContainer>
    </ContentContainer>
  );
}

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

const Footnote = styled(Paragraph)`
  color: var(--grey3);
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

const Bullet = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  position: relative;
  width: 32px;
  height: 32px;
  margin: 6px 16px 0 0;
  padding: 0 0 0 0;
  border-radius: 100%;
  font-size: 18px;
  font-weight: 600;
  background: var(--grey5);
  color: var(--grey3);

  ::after {
    position: absolute;
    content: '';
    width: 6px;
    height: 6px;
    top: 13px;
    left: 13px;
    border-radius: 100%;
    background: var(--grey3);
    transform: rotate(0deg);
  }
`;

const Link = styled.a`
  color: inherit;
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
