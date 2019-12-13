import React from 'react';
import styled from 'styled-components';
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
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
