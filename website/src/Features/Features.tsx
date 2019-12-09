import React from 'react';
import styled from 'styled-components';
import { Center, SlideIn } from '../shared/ui';
import { useViewportEnter } from '../shared/useViewportEnter';

export function Features() {
  const [f1Ref, f1Entered] = useViewportEnter(0.7);
  const [f2Ref, f2Entered] = useViewportEnter(0.7);
  const [f3Ref, f3Entered] = useViewportEnter(0.7);

  return (
    <Container>
      <Feature ref={f1Ref} visible={f1Entered}>
        <Anchor id="visual-tdd" />
        <FeatureIconContainer>
          <RefreshIcon />
        </FeatureIconContainer>
        <div>
          <FeatureTitle>Visual TDD</FeatureTitle>
          <FeatureDescription>
            Develop one component at a time. Isolate the UI you&apos;re working
            on and iterate quickly. Reloading your whole app on every change is
            slowing you down!
          </FeatureDescription>
        </div>
      </Feature>
      <Feature ref={f2Ref} visible={f2Entered}>
        <Anchor id="component-library" />
        <FeatureIconContainer>
          <ListIcon />
        </FeatureIconContainer>
        <div>
          <FeatureTitle>Component library</FeatureTitle>
          <FeatureDescription>
            From blank states to edge cases, define component states to come
            back to. Your component library keeps you organized and provides a
            solid foundation of test cases.
          </FeatureDescription>
        </div>
      </Feature>
      <OpenPlatformFeature ref={f3Ref} visible={f3Entered}>
        <Anchor id="open-platform" />
        <OpenPlatformPattern />
        <OpenPlatformTextOverlay>
          <FeatureTitle>Open platform</FeatureTitle>
          <FeatureDescription>
            React Cosmos can be used in powerful ways. Snapshot and visual
            regression tests are possible, as well as custom integrations
            tailored to your needs.
          </FeatureDescription>
        </OpenPlatformTextOverlay>
      </OpenPlatformFeature>
    </Container>
  );
}

const Container = styled(Center)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Anchor = styled.div`
  position: absolute;
  top: -81px; /* minimized header height */
`;

const Feature = styled(SlideIn)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 10vh;

  @media (max-width: 791px) {
    text-align: center;
  }
`;

const FeatureIconContainer = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  margin: 0 8px 0 16px;
  background: rgba(10, 46, 70, 0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 40px;
    height: 40px;
    opacity: 0.9;
  }
`;

const OpenPlatformFeature = styled.div<{ visible: boolean }>`
  width: 100%;
  height: 600px;
  margin-bottom: 10vh;
  position: relative;
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: translate(0, ${props => (props.visible ? 0 : 10)}vh);
  transition: 0.8s opacity, 1.2s transform;
`;

const OpenPlatformPattern = styled.div`
  width: 100%;
  height: 100%;
  background-color: #093556;
  background-image: url('/space-pattern.png');
  background-repeat: repeat;
  background-position: center center;
  background-size: 200px 200px;
  background-attachment: fixed;
`;

const OpenPlatformTextOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  color: #0a2e46;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
`;

const FeatureTitle = styled.h2`
  margin: 0;
  padding: 32px 24px 8px 24px;
  font-size: 36px;
  line-height: 36px;
  font-weight: 600;
  letter-spacing: -0.03em;
`;

const FeatureDescription = styled.div`
  max-width: 640px;
  padding: 0 24px 32px 24px;
  font-size: 24px;
  line-height: 30px;
  opacity: 0.9;
`;

const RefreshIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const ListIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);
