import React from 'react';
import styled from 'styled-components';
import { useWindowEnter } from './shared/useWindowEnter';

const windowEnterOptions = { threshold: 0.5 };

export function LinksScreen() {
  const [visible, ref] = useWindowEnter(windowEnterOptions);
  return (
    <Container ref={ref}>
      <Title visible={visible}>Don&apos;t settle for localhost:3000</Title>
      <Subtitle visible={visible}>
        Expect more from your dev environment.
      </Subtitle>
      <Links visible={visible}>
        <Link
          href="https://cosmos.flatris.space/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Live demo</span>
          <Chevron />
        </Link>
        <Link
          href="https://twitter.com/ReactCosmos/status/1189127279533793281"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>React Cosmos 5 in 21 tweets</span>
          <Chevron />
        </Link>
      </Links>
    </Container>
  );
}

const Container = styled.div`
  min-height: 50vh;
  padding: 10vh 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const SlideIn = styled.div<{ visible: boolean }>`
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: translate(0, ${props => (props.visible ? 0 : 40)}px);
  transition: 0.6s opacity, 1.2s transform;
`;

const Title = styled(SlideIn)`
  font-size: 40px;
  line-height: 40px;
  font-weight: 600;
  letter-spacing: -0.03em;
  padding: 0 0 12px 0;
`;

const Subtitle = styled(SlideIn)`
  font-size: 28px;
  line-height: 28px;
  font-weight: 300;
  color: #566d7e;
  transition-delay: ${props => (props.visible ? 0.4 : 0)}s;
`;

const Links = styled(SlideIn)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 48px 0 0 0;
  font-size: 20px;
  line-height: 20px;
  transition-delay: ${props => (props.visible ? 0.8 : 0)}s;
`;

const Link = styled.a`
  margin: 16px 12px 0 12px;
  color: #078383;
  font-weight: 400;
  text-decoration: none;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Chevron = () => {
  return (
    <StyledChevron
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </StyledChevron>
  );
};

const StyledChevron = styled.svg`
  width: 20px;
  height: 20px;
  margin: 0 0 0 0px;
  transform: translate(0, 1px);
`;
