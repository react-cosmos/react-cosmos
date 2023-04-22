import { render } from '@testing-library/react';
import React from 'react';
import { HomeOverlay } from './HomeOverlay.js';

it('renders "welcome" state', () => {
  const { queryByTestId } = render(
    <HomeOverlay
      welcomeDismissed={false}
      onDismissWelcome={() => {}}
      onShowWelcome={() => {}}
    />
  );
  expect(queryByTestId('welcome')).not.toBeNull();
});

it('renders "blank" state', () => {
  const { queryByTestId } = render(
    <HomeOverlay
      welcomeDismissed={true}
      onDismissWelcome={() => {}}
      onShowWelcome={() => {}}
    />
  );
  expect(queryByTestId('blank')).not.toBeNull();
});
