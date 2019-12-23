import React from 'react';
import styled from 'styled-components';
import { ExternalLink } from '../shared/ExternalLink';
import { InternalLink } from '../shared/InternalLink';

const centerHeaderBreakpoint = 367;
const maxHeaderWidth = 640;

type Props = {
  visible: boolean;
  fixed: boolean;
};

export function Header({ visible, fixed }: Props) {
  return (
    <Container
      style={{
        position: fixed ? 'fixed' : 'absolute',
        top: fixed ? 0 : 'auto',
        opacity: visible ? 1 : 0
      }}
    >
      <Content>
        <CosmonautContainer>
          <CosmonautButton to="/" />
        </CosmonautContainer>
        <Body>
          <Title>
            <InternalLink to="/">React Cosmos</InternalLink>
          </Title>
          <Links>
            <ExternalLink href="https://github.com/react-cosmos/react-cosmos/blob/master/README.md#table-of-contents">
              Docs
            </ExternalLink>
            <Separator>/</Separator>
            <InternalLink to="/about">About</InternalLink>
            <Separator>/</Separator>
            <ExternalLink href="https://github.com/sponsors/skidding">
              Sponsor
            </ExternalLink>
          </Links>
        </Body>
        <GitHubButton href="https://github.com/react-cosmos/react-cosmos">
          <GitHub />
        </GitHubButton>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(10, 46, 70, 0.24);
  backdrop-filter: saturate(180%) blur(15px);
  transition: 0.4s opacity;
`;

const Content = styled.div`
  max-width: ${maxHeaderWidth}px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CosmonautContainer = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  margin-left: 8px;
  background-image: url('/cosmonaut128.png');
  background-size: 64px;
`;

const CosmonautButton = styled(InternalLink)`
  display: block;
  width: 64px;
  height: 64px;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
`;

const GitHubButton = styled(ExternalLink)`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  margin: 0 8px 0 0;
  color: rgba(10, 46, 70, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    display: block;
    width: 64px;
    height: 64px;
  }

  @media (max-width: ${centerHeaderBreakpoint}px) {
    display: none;
  }
`;

export function GitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const Body = styled.div`
  flex: 1;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${centerHeaderBreakpoint}px) {
    padding-right: 16px;
    align-items: flex-end;
  }
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 28px;
  white-space: nowrap;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Links = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  line-height: 20px;

  a {
    color: inherit;
    font-weight: 400;
    text-decoration: none;
    opacity: 0.9;

    :hover {
      text-decoration: underline;
    }
  }
`;

const Separator = styled.span`
  margin: 0 8px;
  font-weight: 300;
  opacity: 0.5;
`;
