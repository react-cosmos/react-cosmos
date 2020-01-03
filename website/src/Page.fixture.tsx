import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { Benefits } from './Benefits';
import { Demo } from './Demo';
import { ComponentLibrary } from './Features/ComponentLibrary';
import { OpenPlatform } from './Features/OpenPlatform';
import { VisualTdd } from './Features/VisualTdd';
import { Page } from './Page';

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
  )
};
