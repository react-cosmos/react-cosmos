import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { MAX_CONTENT_WIDTH_PX } from './shared';
import { CONTENT_TOP_PADDING_PX, useHeaderScroll } from './useHeaderScroll';
import { useWindowViewport } from './useWindowViewport';
import { useWindowYScroll } from './useWindowYScroll';

export function Root() {
  const windowViewport = useWindowViewport();
  const yScroll = useWindowYScroll();
  const { cropRatio, minimizeRatio } = useHeaderScroll(yScroll);
  const showContent = minimizeRatio === 1;

  return (
    <Container style={{ background: cropRatio > 0.5 ? '#fff' : '#0a2e46' }}>
      <Header
        windowViewport={windowViewport}
        cropRatio={cropRatio}
        minimizeRatio={minimizeRatio}
      />
      <Content>
        <Section style={{ margin: `50vh 0 0 0` }}>
          <Features style={{ opacity: showContent ? 1 : 0 }}>
            <Feature>
              <FeatureTitle>Visual TDD</FeatureTitle>
              <FeatureDescription>
                Develop one component at a time. Isolate the UI you&apos;re
                working on and iterate quickly. Reloading your whole app on
                every change is slowing you down!
              </FeatureDescription>
            </Feature>
            <Feature>
              <FeatureTitle>Component library</FeatureTitle>
              <FeatureDescription>
                From blank states to edge cases, define component states to come
                back to. Your component library keeps you organized and makes a
                great foundation of test cases.
              </FeatureDescription>
            </Feature>
            <Feature>
              <FeatureTitle>Open platform</FeatureTitle>
              <FeatureDescription>
                React Cosmos is simple, but can be used in powerful ways.
                Snapshot and visual regression tests are possible, as well as
                custom integrations tailored to your needs.
              </FeatureDescription>
            </Feature>
          </Features>
        </Section>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  padding-top: ${CONTENT_TOP_PADDING_PX}px;
  color: #0a2e46;
`;

const Content = styled.div`
  max-width: ${MAX_CONTENT_WIDTH_PX}px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 24px;
  line-height: 1.5em;
`;

const Section = styled.div``;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.4s opacity;
`;

const Feature = styled.div`
  max-width: 640px;
  margin-bottom: 128px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const FeatureTitle = styled.h2`
  margin: 0;
  padding: 0 0 8px 0;
  font-size: 36px;
  line-height: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

const FeatureDescription = styled.div`
  font-size: 24px;
  line-height: 30px;
  opacity: 0.8;
`;
