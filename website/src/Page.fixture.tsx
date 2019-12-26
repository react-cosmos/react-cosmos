import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { Benefits } from './Benefits';
import { ComponentLibrary } from './Features/ComponentLibrary';
import { OpenPlatform } from './Features/OpenPlatform';
import { VisualTdd } from './Features/VisualTdd';
import { Page } from './Page';
import { contentMaxWidth } from './shared/breakpoints';

const Container = styled.div`
  padding: calc(81px + 256px) 0 256px 0;
`;

const Center = styled(Container)`
  max-width: ${contentMaxWidth}px;
  margin: 0 auto;
`;

export default {
  'visual-tdd': (
    <Page>
      <Center>
        <VisualTdd />
      </Center>
    </Page>
  ),
  'component-library': (
    <Page>
      <Center>
        <ComponentLibrary />
      </Center>
    </Page>
  ),
  'open-platform': (
    <Page>
      <Center>
        <OpenPlatform />
      </Center>
    </Page>
  ),
  benefits: (
    <Page>
      <Container>
        <Benefits />
      </Container>
    </Page>
  ),
  about: (
    <Page>
      <About />
    </Page>
  )
};
