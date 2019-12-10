import React from 'react';
import styled from 'styled-components';
import { Center } from '../shared/ui';
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

const Container = styled(Center)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
