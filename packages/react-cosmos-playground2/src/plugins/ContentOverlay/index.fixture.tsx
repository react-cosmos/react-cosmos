import React from 'react';
import {
  DreamerIllustration,
  EmptyIllustration
} from '../../shared/illustrations';
import { NoFixtureSelected } from './NoFixtureSelected';
import { RendererNotResponding } from './RendererNotResponding';
import {
  ContentContainer,
  Delay,
  IllustrationContainer,
  OverlayContainer
} from './shared';
import { WelcomeCosmos } from './WelcomeCosmos';

export default {
  waiting: (
    <OverlayContainer>
      <ContentContainer>
        <IllustrationContainer>
          <Delay>
            <DreamerIllustration title="waiting" />
          </Delay>
        </IllustrationContainer>
      </ContentContainer>
    </OverlayContainer>
  ),

  'not found': (
    <OverlayContainer>
      <ContentContainer>
        <IllustrationContainer>
          <EmptyIllustration title="not found" />
        </IllustrationContainer>
      </ContentContainer>
    </OverlayContainer>
  ),

  welcome: (
    <OverlayContainer>
      <WelcomeCosmos onDismissWelcome={() => console.log('dismiss welcome')} />
    </OverlayContainer>
  ),

  'no fixture selected': (
    <OverlayContainer>
      <NoFixtureSelected onShowWelcome={() => console.log('show welcome')} />
    </OverlayContainer>
  ),

  'renderer not responding': (
    <OverlayContainer>
      <RendererNotResponding />
    </OverlayContainer>
  )
};
