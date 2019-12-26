import React from 'react';
import styled from 'styled-components';
import { mobileMaxWidth } from '../shared/breakpoints';
import { ComponentLibrary } from './ComponentLibrary';
import { OpenPlatform } from './OpenPlatform';
import { maxFeatureColumnsWidth, minFeatureColumnsWidth } from './shared';
import { VisualTdd } from './VisualTdd';

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
  padding: calc(81px + 96px) 0 192px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${mobileMaxWidth}px) {
    padding-top: calc(81px + 64px);
    padding-bottom: 128px;
  }

  @media (min-width: ${minFeatureColumnsWidth}px) {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-around;
  }
`;
