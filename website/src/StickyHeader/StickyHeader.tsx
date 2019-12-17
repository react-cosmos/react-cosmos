import React from 'react';
import styled from 'styled-components';
import { ExternalLink } from '../shared/ExternalLink';
import { Heart } from '../shared/Heart';
import { InternalLink } from '../shared/InternalLink';
import { useViewportEnter } from '../shared/useViewportEnter';

const centerHeaderBreakpoint = 383;
const maxHeaderWidth = 640;

export function StickyHeader() {
  const [ref, entered] = useViewportEnter(0.5);
  return (
    <Container ref={ref} style={{ opacity: entered ? 1 : 0 }}>
      <Content>
        <CosmonautContainer>
          <CosmonautButton to="/" />
        </CosmonautContainer>
        <Body>
          <Title>
            <InternalLink to="/">React Cosmos</InternalLink>
          </Title>
          <Links>
            <Link href="https://github.com/react-cosmos/react-cosmos">
              GitHub
            </Link>
            <Separator>/</Separator>
            <Link href="https://join-react-cosmos.now.sh">Slack</Link>
            <Separator>/</Separator>
            <Link href="https://twitter.com/ReactCosmos">Twitter</Link>
          </Links>
        </Body>
        <HeartButton to="/about">
          <Heart />
        </HeartButton>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid rgba(10, 46, 70, 0.24);
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

const HeartButton = styled(InternalLink)`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  margin: 0 8px 0 0;
  background: rgba(231, 0, 138, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    margin-top: 2px;
    width: 36px;
    height: 36px;
    fill: rgba(231, 0, 138, 0.8);
  }

  @media (max-width: ${centerHeaderBreakpoint}px) {
    display: none;
  }
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
  font-size: 16px;
  font-weight: 300;
  line-height: 20px;
`;

const Link = styled(ExternalLink)`
  color: inherit;
  font-weight: 400;
  text-decoration: none;
  opacity: 0.8;

  :hover {
    text-decoration: underline;
  }
`;

const Separator = styled.span`
  margin: 0 8px;
  opacity: 0.5;
`;
