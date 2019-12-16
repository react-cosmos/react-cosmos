import React from 'react';
import styled from 'styled-components';
import { contentMaxWidth } from '../shared/ui';
import { ComponentLibrary } from './ComponentLibrary';
import { OpenPlatform } from './OpenPlatform';
import { VisualTdd } from './VisualTdd';

export function Features() {
  return (
    <Container>
      <VisualTdd />
      <ComponentLibrary />
      <OpenPlatform />
    </Container>
  );
}

const Container = styled.div`
  max-width: ${contentMaxWidth}px;
  margin: 0 auto;
  padding: 40vh 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
