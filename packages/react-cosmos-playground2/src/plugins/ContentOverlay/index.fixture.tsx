import React from 'react';
import {
  DreamerIllustration,
  EmptyIllustration
} from '../../shared/illustrations';
import { RendererNotResponding } from './RendererNotResponding';
import { WelcomeCosmosNext } from './WelcomeCosmosNext';
import {
  Container,
  IllustrationContainer,
  ContentContainer,
  Delay
} from './shared';

export default {
  waiting: (
    <Container>
      <ContentContainer>
        <IllustrationContainer>
          <Delay>
            <DreamerIllustration title="waiting" />
          </Delay>
        </IllustrationContainer>
      </ContentContainer>
    </Container>
  ),

  'not found': (
    <Container>
      <ContentContainer>
        <IllustrationContainer>
          <EmptyIllustration title="not found" />
        </IllustrationContainer>
      </ContentContainer>
    </Container>
  ),

  welcome: (
    <Container>
      <WelcomeCosmosNext />
    </Container>
  ),

  'renderer not responding': (
    <Container>
      <RendererNotResponding />
    </Container>
  )
};
