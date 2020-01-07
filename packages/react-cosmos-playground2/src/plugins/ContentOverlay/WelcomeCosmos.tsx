import React from 'react';
import styled from 'styled-components';
import { AstronautIllustration } from '../../shared/illustrations';
import {
  screenGrey1,
  screenGrey3,
  screenGrey5,
  screenPrimary1,
  screenPrimary2,
  screenPrimary3
} from '../../shared/ui/colors';
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
                href="https://github.com/react-cosmos/react-cosmos/tree/master/docs"
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
  color: ${screenPrimary2};
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
    background: ${screenPrimary2};
  }
`;

const Paragraph = styled.p`
  margin: 16px 0;

  :last-child {
    margin-bottom: 0;
  }
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
  background: ${screenGrey5};
  color: ${screenGrey3};

  ::after {
    position: absolute;
    content: '';
    width: 6px;
    height: 6px;
    top: 13px;
    left: 13px;
    border-radius: 100%;
    background: ${screenGrey3};
    transform: rotate(0deg);
  }
`;

const Link = styled.a`
  color: ${screenGrey1};
`;

const Highlight = styled.span`
  padding: 2px 4px;
  border-radius: 2px;
  background: rgba(255, 255, 200, 0.88);
  color: black;
`;

const actionLinkHeight = 36;

const ActionLink = styled.a`
  display: inline-block;
  height: ${actionLinkHeight}px;
  padding: 0 16px;
  background: ${screenPrimary3};
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  line-height: ${actionLinkHeight}px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transform: translate3d(0, 0, 0);
  animation: pulse 10s ease-out infinite;
  outline: none;

  :focus {
    box-shadow: 0 0 0px 2px ${screenPrimary1};
  }

  ::-moz-focus-inner {
    border: 0;
  }

  @keyframes pulse {
    21.25% {
      background: ${screenPrimary3};
    }
    25% {
      background: ${screenPrimary2};
    }
    30% {
      background: ${screenPrimary3};
    }
  }
`;
