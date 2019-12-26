import React from 'react';
import styled from 'styled-components';
import { getSlideInStyle, slideInTransition } from '../shared/slideIn';
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
          React Cosmos can be used in powerful ways. Including snapshot and
          visual regression tests, as well as custom integrations tailored to
          your needs.
        </FeatureDescription>
      </OpenPlatformTextOverlay>
    </OpenPlatformFeature>
  );
}

const OpenPlatformFeature = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
  transition: ${slideInTransition};
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

  @media (prefers-reduced-motion: reduce) {
    background-attachment: scroll;
  }
`;

const OpenPlatformTextOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 0;
  background: rgba(255, 255, 255, 0.9);
  color: #0a2e46;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
`;
