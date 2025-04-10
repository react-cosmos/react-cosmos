import React, { ComponentType, isValidElement, ReactNode } from 'react';
import { ReactFixture } from 'react-cosmos-core';

export function createFixtureNode(fixture: ReactFixture): React.ReactNode {
  // Warning: In a React Server Components setup this function is called on the
  // server. When a fixture module uses the 'use client' directive, the fixture
  // export will be a Promise wrapper (imbued with magical properties methinks).
  // This results in the following limitation: In a React Server Components
  // setup, Client fixtures have to export a single function component. They
  // can't be multi fixtures and they can't export React elements directly.
  return isNodeFixture(fixture) ? (
    fixture
  ) : (
    <FixtureElement Component={fixture} />
  );
}

function isNodeFixture(fixture: ReactFixture): fixture is ReactNode {
  // If you're curious what the exact type of ReactNode is:
  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6fc4839a810335dee15374e6bc82dbbc2bbdff58/types/react/index.d.ts#L478-L489
  return (
    fixture === undefined ||
    fixture === null ||
    typeof fixture === 'string' ||
    typeof fixture === 'number' ||
    typeof fixture === 'boolean' ||
    Array.isArray(fixture) ||
    // If you're curious what isElement checks:
    // https://github.com/facebook/react/blob/1b0132c05acabae5aebd32c2cadddfb16bda70bc/packages/react-is/src/ReactIs.js#L108-L114
    isValidElement(fixture)
  );
}

function FixtureElement({ Component }: { Component: ComponentType }) {
  return <Component />;
}
FixtureElement.cosmosCapture = false;
