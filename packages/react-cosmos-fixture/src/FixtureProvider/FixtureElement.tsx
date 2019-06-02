import React from 'react';

type Props = {
  ElementType: Function;
};

export function FixtureElement({ ElementType }: Props) {
  return <ElementType />;
}

FixtureElement.cosmosCapture = false;
