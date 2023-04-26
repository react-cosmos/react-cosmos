import React from 'react';
import styled from 'styled-components';
import { ComponentLibrary } from './ComponentLibrary.js';
import { OpenPlatform } from './OpenPlatform.js';
import { VisualTdd } from './VisualTdd.js';
import { maxFeatureColumnsWidth, minFeatureColumnsWidth } from './shared.js';

export function Features() {
  return (
    <Container id="features">
      <VisualTdd />
      <ComponentLibrary />
      <OpenPlatform />
    </Container>
  );
}

const Container = styled.div`
  max-width: ${maxFeatureColumnsWidth}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${minFeatureColumnsWidth}px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-around;
  }
`;
