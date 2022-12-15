import React from 'react';
import { getSlideInStyle } from '../shared/slideIn.js';
import { useViewportEnter } from '../shared/useViewportEnter.js';
import {
  Feature,
  FeatureDescription,
  FeatureIconContainer,
  FeatureTitle,
} from './shared.js';

export function OpenPlatform() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <Feature id="open-platform" ref={ref} style={getSlideInStyle(entered)}>
      <FeatureIconContainer>
        <PackageIcon />
      </FeatureIconContainer>
      <div>
        <FeatureTitle>Open platform</FeatureTitle>
        <FeatureDescription>
          React Cosmos can be used in powerful ways. Including snapshot and
          visual regression testing, as well as custom integrations tailored to
          your needs.
        </FeatureDescription>
      </div>
    </Feature>
  );
}

const PackageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
