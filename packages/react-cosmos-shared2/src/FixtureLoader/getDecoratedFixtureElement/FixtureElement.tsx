import React from 'react';

type Props = {
  Component: React.FunctionComponent;
};

export function FixtureElement({ Component }: Props) {
  return <Component />;
}

FixtureElement.cosmosCapture = false;
