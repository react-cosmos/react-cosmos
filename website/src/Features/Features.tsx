import React from 'react';
import styled from 'styled-components';
import { contentMaxWidth } from '../shared/breakpoints';
import { ComponentLibrary } from './ComponentLibrary';
import { OpenPlatform } from './OpenPlatform';
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
  max-width: ${contentMaxWidth}px;
  margin: 0 auto;
  padding: calc(81px + 20vh) 0 40vh 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
