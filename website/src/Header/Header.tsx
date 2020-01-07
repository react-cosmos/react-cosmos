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
  const version = getVersion();
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
          <CosmonautButton to="/" visualOnly />
        </CosmonautContainer>
        <Body>
          <Title>
            <InternalLink to="/">React Cosmos</InternalLink>
          </Title>
          <Links>
            <ExternalLink href="https://github.com/react-cosmos/react-cosmos/tree/master/docs">
              Docs
            </ExternalLink>
            <LinkSeparator>/</LinkSeparator>
            <InternalLink to="/demo">Demo</InternalLink>
            <LinkSeparator>/</LinkSeparator>
            <ExternalLink href="https://github.com/sponsors/skidding">
              Sponsor
            </ExternalLink>
          </Links>
        </Body>
        <RightSide>
          <ReleasesLink href="https://github.com/react-cosmos/react-cosmos/releases">
            v{version}
          </ReleasesLink>
          <GitHubLink href="https://github.com/react-cosmos/react-cosmos">
            GitHub
          </GitHubLink>
        </RightSide>
      </Content>
    </Container>
  );
}

function getVersion(): string {
  // @ts-ignore
  return typeof RC_VERSION === 'string' ? RC_VERSION : '5.0.0';
}

const Container = styled.div`
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.92);
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
  line-height: 20px;

  a {
    color: inherit;
    text-decoration: none;
    opacity: 0.9;

    :hover {
      text-decoration: underline;
    }
  }
`;

const LinkSeparator = styled.span`
  margin: 0 8px;
  font-weight: 300;
  opacity: 0.5;
`;

const RightSide = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 56px;
  margin: 0 8px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: ${centerHeaderBreakpoint}px) {
    display: none;
  }
`;

const ReleasesLink = styled(ExternalLink)`
  background: rgba(10, 46, 70, 0.08);
  color: inherit;
  border-radius: 3px;
  margin: 0 0 8px 0;
  padding: 0 8px;
  text-decoration: none;
  font-weight: 500;
  line-height: 28px;

  :hover {
    text-decoration: underline;
  }
`;

const GitHubLink = styled(ExternalLink)`
  color: inherit;
  line-height: 20px;
  text-decoration: none;
  opacity: 0.9;

  :hover {
    text-decoration: underline;
  }
`;
