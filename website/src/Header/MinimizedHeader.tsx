import React from 'react';
import styled from 'styled-components';
import { ExternalLink } from '../shared/ExternalLink';
import { InternalLink } from '../shared/InternalLink';
import { Heart } from '../shared/ui';
import {
  COSMONAUT_HPADDING_PX,
  COSMONAUT_SIZE_PX,
  HEADER_HEIGHT_PX,
  MAX_HEADER_WIDTH_PX,
  MIN_CENTER_HEADER_WIDTH_PX
} from './shared';

type Props = {
  viewportWidth: number;
  visible: boolean;
};

export function MinimizedHeader({ viewportWidth, visible }: Props) {
  const center = viewportWidth >= MIN_CENTER_HEADER_WIDTH_PX;
  return (
    <Container style={{ opacity: visible ? 1 : 0 }}>
      <CosmonautButton to="/" />
      <MainContent center={center}>
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
      </MainContent>
      {center && (
        <HeartButton to="/about">
          <Heart />
        </HeartButton>
      )}
    </Container>
  );
}

const Container = styled.div`
  max-width: ${MAX_HEADER_WIDTH_PX}px;
  height: ${HEADER_HEIGHT_PX}px;
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: 0.4s opacity;
`;

const CosmonautButton = styled(InternalLink)`
  flex-shrink: 0;
  width: ${COSMONAUT_SIZE_PX}px;
  height: ${COSMONAUT_SIZE_PX}px;
  margin-left: ${COSMONAUT_HPADDING_PX}px;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
`;

const HeartButton = styled(InternalLink)`
  flex-shrink: 0;
  width: ${COSMONAUT_SIZE_PX}px;
  height: ${COSMONAUT_SIZE_PX}px;
  margin: 0 ${COSMONAUT_HPADDING_PX}px 0 0;
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
`;

const MainContent = styled.div<{ center: boolean }>`
  flex: 1;
  height: 56px;
  padding-right: ${props => (props.center ? 0 : 16)}px;
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.center ? 'center' : 'flex-end')};
  justify-content: space-between;
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

const Separator = styled.div`
  margin: 0 8px;
  opacity: 0.5;
`;
