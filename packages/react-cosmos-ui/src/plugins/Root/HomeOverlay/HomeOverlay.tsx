import React from 'react';
import { OverlayContainer } from '../../../components/ContentOverlay.js';
import { NoFixtureSelected } from './NoFixtureSelected.js';
import { WelcomeCosmos } from './WelcomeCosmos.js';

type Props = {
  welcomeDismissed: boolean;
  onDismissWelcome: () => unknown;
  onShowWelcome: () => unknown;
};

export function HomeOverlay({
  welcomeDismissed,
  onDismissWelcome,
  onShowWelcome,
}: Props) {
  if (welcomeDismissed) {
    return (
      <OverlayContainer data-testid="blank">
        <NoFixtureSelected onShowWelcome={onShowWelcome} />
      </OverlayContainer>
    );
  }

  return (
    <OverlayContainer data-testid="welcome">
      <WelcomeCosmos onDismissWelcome={onDismissWelcome} />
    </OverlayContainer>
  );
}
