import React from 'react';
import styled from 'styled-components';
import { AstronautIllustration } from '../../shared/illustrations';
import {
  ContentContainer,
  IllustrationContainer,
  NoWrap,
  SecondaryButton,
  TextContainer
} from './shared';

type Props = {
  onDismissWelcome: () => unknown;
};

export function WelcomeCosmos({ onDismissWelcome }: Props) {
  return (
    <ContentContainer>
      <TextContainer>
        <Header>
          Welcome to <NoWrap>React Cosmos</NoWrap>
        </Header>
        <List>
          <li>
            <Bullet />
            <span>
              <Link
                href="https://github.com/react-cosmos/react-cosmos/blob/master/README.md"
                rel="noopener noreferrer"
                target="_blank"
              >
                <strong>Read the docs</strong>
              </Link>{' '}
              to get the most out of React Cosmos.
              <br />
              Chat with us on{' '}
              <Link
                href="https://join-react-cosmos.now.sh/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Slack
              </Link>
              . Report detailed issues on{' '}
              <Link
                href="https://github.com/react-cosmos/react-cosmos/issues"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </Link>
              .
            </span>
          </li>
          <li>
            <Bullet />
            <span>
              <Link
                href="https://github.com/users/skidding/sponsorship"
                rel="noopener noreferrer"
                target="_blank"
              >
                <strong>Become a Sponsor</strong>
              </Link>{' '}
              to invest in the future of React Cosmos.
              <br />
              {`Don't worry if you can't. `}
              <Highlight>React Cosmos will always be free.</Highlight>
            </span>
          </li>
        </List>
        <Paragraph>
          <ActionLink
            href="https://forms.gle/yvoie73Rfo6Zy7no7"
            rel="noopener noreferrer"
            target="_blank"
          >
            share your feedback
          </ActionLink>
          <SecondaryButton onClick={onDismissWelcome}>
            hide this screen
          </SecondaryButton>
        </Paragraph>
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

const List = styled.ul`
  margin: 0 0 48px 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 24px;
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
  color: var(--grey1);
`;

const Highlight = styled.span`
  background: rgba(255, 255, 200, 0.64);
  padding: 2px 4px;
  color: black;
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
  transform: translate3d(0, 0, 0);
  animation: pulse 10s ease-out infinite;
  outline: none;

  :focus {
    box-shadow: 0 0 0px 2px var(--primary2);
  }

  ::-moz-focus-inner {
    border: 0;
  }

  @keyframes pulse {
    21.25% {
      background: var(--primary4);
    }
    25% {
      background: var(--primary3);
    }
    30% {
      background: var(--primary4);
    }
  }
`;
