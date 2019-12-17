import React from 'react';
import { getSlideInStyle } from '../shared/slideIn';
import { useViewportEnter } from '../shared/useViewportEnter';
import {
  Feature,
  FeatureDescription,
  FeatureIconContainer,
  FeatureTitle
} from './shared';

export function VisualTdd() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <Feature id="visual-tdd" ref={ref} style={getSlideInStyle(entered)}>
      <FeatureIconContainer>
        <RefreshIcon />
      </FeatureIconContainer>
      <div>
        <FeatureTitle>Visual TDD</FeatureTitle>
        <FeatureDescription>
          Develop one component at a time. Isolate the UI you&apos;re working on
          and iterate quickly. Reloading your whole app on every change is
          slowing you down!
        </FeatureDescription>
      </div>
    </Feature>
  );
}

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
