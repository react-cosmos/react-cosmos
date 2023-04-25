import React from 'react';
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
  return welcomeDismissed ? (
    <NoFixtureSelected onShowWelcome={onShowWelcome} />
  ) : (
    <WelcomeCosmos onDismissWelcome={onDismissWelcome} />
  );
}
