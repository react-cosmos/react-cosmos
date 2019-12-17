import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { Benefits } from './Benefits';
import { ComponentLibrary } from './Features/ComponentLibrary';
import { OpenPlatform } from './Features/OpenPlatform';
import { VisualTdd } from './Features/VisualTdd';
import { Page } from './Page';
import { contentMaxWidth } from './shared/breakpoints';

const Center = styled.div`
  max-width: ${contentMaxWidth}px;
  margin: 0 auto;
  padding: calc(81px + 20vh) 0 20vh 0;
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
      <Center>
        <Benefits />
      </Center>
    </Page>
  ),
  about: (
    <Page>
      <About />
    </Page>
  )
};
