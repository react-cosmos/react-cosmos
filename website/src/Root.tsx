import React from 'react';
import styled from 'styled-components';
import { ComponentLibraryPreview } from './ComponentLibraryPreview';
import { Header } from './Header/Header';
import { HEADER_HEIGHT_PX, MAX_CONTENT_WIDTH_PX } from './shared';
import { CONTENT_TOP_PADDING_PX, useHeaderScroll } from './useHeaderScroll';
import { useWindowViewport } from './useWindowViewport';
import { useWindowYScroll } from './useWindowYScroll';

export function Root() {
  const windowViewport = useWindowViewport();
  const yScroll = useWindowYScroll();
  const { cropRatio, minimizeRatio } = useHeaderScroll(yScroll);
  const showContent = minimizeRatio === 1;

  return (
    <Container white={cropRatio > 0.1}>
      <Header
        windowViewport={windowViewport}
        cropRatio={cropRatio}
        minimizeRatio={minimizeRatio}
      />
      <Content>
        <Features style={{ opacity: showContent ? 1 : 0 }}>
          <Feature>
            <FeaturePreviewContainer>
              <ComponentLibraryPreview />
            </FeaturePreviewContainer>
            <FeatureTextOverlay>
              <FeatureTitle>Component library</FeatureTitle>
              <FeatureDescription>
                From blank states to edge cases, define component states to come
                back to. Your component library keeps you organized and provides
                a solid foundation of test cases.
              </FeatureDescription>
            </FeatureTextOverlay>
          </Feature>
          {/* <Feature>
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
              back to. Your component library keeps you organized and provides a
              solid foundation of test cases.
            </FeatureDescription>
          </Feature>
          <Feature>
            <FeatureTitle>Open platform</FeatureTitle>
            <FeatureDescription>
              React Cosmos can be used in powerful ways. Snapshot and visual
              regression tests are possible, as well as custom integrations
              tailored to your needs.
            </FeatureDescription>
          </Feature> */}
        </Features>
      </Content>
    </Container>
  );
}

const SECTION_PADDING_PX = 128;

const Container = styled.div<{ white: boolean }>`
  padding-top: ${CONTENT_TOP_PADDING_PX}px;
  padding-bottom: ${CONTENT_TOP_PADDING_PX}px;
  background: ${props => (props.white ? '#fff' : '#093556')};
  color: #0a2e46;
`;

const Content = styled.div`
  max-width: ${MAX_CONTENT_WIDTH_PX}px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: ${HEADER_HEIGHT_PX + 256}px 0 0 0;
  line-height: 1.5em;
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.4s opacity;
`;

const Feature = styled.div`
  width: 100%;
  height: 600px;
  margin-bottom: ${SECTION_PADDING_PX}px;
  position: relative;
`;

const FeaturePreviewContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const FeatureTextOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
`;

const FeatureTitle = styled.h2`
  margin: 0;
  padding: 32px 0 8px 0;
  color: #fff;
  font-size: 36px;
  line-height: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

const FeatureDescription = styled.div`
  max-width: 640px;
  padding: 0 24px 32px 24px;
  color: #fff;
  font-size: 24px;
  line-height: 30px;
  opacity: 0.9;
`;
