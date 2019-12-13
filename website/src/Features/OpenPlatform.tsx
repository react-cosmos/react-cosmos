import React from 'react';
import styled from 'styled-components';
import { slideInOpacityDuration, slideInYDuration } from '../shared/ui';
import { useViewportEnter } from '../shared/useViewportEnter';
import { FeatureDescription, FeatureTitle } from './shared';

export function OpenPlatform() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <OpenPlatformFeature
      id="open-platform"
      ref={ref}
      style={getSlideInStyle(entered)}
    >
      <OpenPlatformPattern />
      <OpenPlatformTextOverlay>
        <FeatureTitle>Open platform</FeatureTitle>
        <FeatureDescription>
          React Cosmos can be used in powerful ways. Snapshot and visual
          regression tests are possible, as well as custom integrations tailored
          to your needs.
        </FeatureDescription>
      </OpenPlatformTextOverlay>
    </OpenPlatformFeature>
  );
}

function getSlideInStyle(visible: boolean, nth: number = 0) {
  return {
    transform: `translate(0, ${visible ? 0 : 10}vh)`,
    opacity: visible ? 1 : 0
  };
}

const OpenPlatformFeature = styled.div`
  width: 100%;
  height: 600px;
  margin-bottom: 10vh;
  position: relative;
  transition: ${slideInOpacityDuration}s opacity, ${slideInYDuration}s transform;

  :last-child {
    margin-bottom: 0;
  }
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  color: #0a2e46;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
`;
