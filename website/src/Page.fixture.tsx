import React from 'react';
import styled from 'styled-components';
import { About } from './About.js';
import { Benefits } from './Benefits.js';
import { Demo } from './Demo.js';
import { ComponentLibrary } from './Features/ComponentLibrary.js';
import { OpenPlatform } from './Features/OpenPlatform.js';
import { VisualTdd } from './Features/VisualTdd.js';
import { Page } from './Page.js';

const Container = styled.div`
  padding: calc(81px + 256px) 0 256px 0;
`;

const FeatureContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default {
  'visual-tdd': (
    <Page>
      <FeatureContainer>
        <VisualTdd />
      </FeatureContainer>
    </Page>
  ),
  'component-library': (
    <Page>
      <FeatureContainer>
        <ComponentLibrary />
      </FeatureContainer>
    </Page>
  ),
  'open-platform': (
    <Page>
      <FeatureContainer>
        <OpenPlatform />
      </FeatureContainer>
    </Page>
  ),
  benefits: (
    <Page>
      <Container>
        <Benefits />
      </Container>
    </Page>
  ),
  demo: (
    <Page>
      <Container>
        <Demo />
      </Container>
    </Page>
  ),
  about: (
    <Page>
      <About />
    </Page>
  ),
};
