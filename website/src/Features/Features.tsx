import React from 'react';
import styled from 'styled-components';
import { useWindowEnter } from '../shared/useWindowEnter';
import { ComponentLibraryPreview } from './ComponentLibraryPreview';
import { VisualTddPreview } from './VisualTddPreview';

export function Features() {
  const [f1Visible, f1Ref] = useWindowEnter({ threshold: 0.5 });
  const [f2Visible, f2Ref] = useWindowEnter({ threshold: 0.5 });
  const [f3Visible, f3Ref] = useWindowEnter({ threshold: 0.5 });

  return (
    <Container>
      <Feature ref={f1Ref} visible={f1Visible}>
        <FeaturePreviewContainer>
          <VisualTddPreview />
        </FeaturePreviewContainer>
        <DarkFeatureTextOverlay>
          <FeatureTitle>Visual TDD</FeatureTitle>
          <FeatureDescription>
            Develop one component at a time. Isolate the UI you&apos;re working
            on and iterate quickly. Reloading your whole app on every change is
            slowing you down!
          </FeatureDescription>
        </DarkFeatureTextOverlay>
      </Feature>
      <Feature ref={f2Ref} visible={f2Visible}>
        <FeaturePreviewContainer>
          <ComponentLibraryPreview />
        </FeaturePreviewContainer>
        <DarkFeatureTextOverlay>
          <FeatureTitle>Component library</FeatureTitle>
          <FeatureDescription>
            From blank states to edge cases, define component states to come
            back to. Your component library keeps you organized and provides a
            solid foundation of test cases.
          </FeatureDescription>
        </DarkFeatureTextOverlay>
      </Feature>
      <Feature ref={f3Ref} visible={f3Visible}>
        <OpenPlatformPreview />
        <LightFeatureTextOverlay>
          <FeatureTitle>Open platform</FeatureTitle>
          <FeatureDescription>
            React Cosmos can be used in powerful ways. Snapshot and visual
            regression tests are possible, as well as custom integrations
            tailored to your needs.
          </FeatureDescription>
        </LightFeatureTextOverlay>
      </Feature>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Feature = styled.div<{ visible: boolean }>`
  width: 100%;
  height: 600px;
  margin-bottom: 10vh;
  position: relative;
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: translate(0, ${props => (props.visible ? 0 : 10)}vh);
  transition: 0.6s opacity, 1.2s transform;
`;

const FeaturePreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #e1e1e1;
`;

const OpenPlatformPreview = styled(FeaturePreviewContainer)`
  background-color: #093556;
  background-image: url('/space-pattern.png');
  background-repeat: repeat;
  background-position: center center;
  background-size: 200px 200px;
  background-attachment: fixed;
`;

const DarkFeatureTextOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
`;

const LightFeatureTextOverlay = styled(DarkFeatureTextOverlay)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  color: #0a2e46;
`;

const FeatureTitle = styled.h2`
  margin: 0;
  padding: 32px 0 8px 0;
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
