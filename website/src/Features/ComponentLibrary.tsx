import React from 'react';
import { useViewportEnter } from '../shared/useViewportEnter';
import {
  Feature,
  FeatureDescription,
  FeatureIconContainer,
  FeatureTitle
} from './shared';

export function ComponentLibrary() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <Feature id="component-library" ref={ref} visible={entered}>
      <FeatureIconContainer>
        <ListIcon />
      </FeatureIconContainer>
      <div>
        <FeatureTitle>Component library</FeatureTitle>
        <FeatureDescription>
          From blank states to edge cases, define component states to come back
          to. Your component library keeps you organized and provides a solid
          foundation of test cases.
        </FeatureDescription>
      </div>
    </Feature>
  );
}

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
