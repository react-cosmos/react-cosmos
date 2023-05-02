import React, { useMemo } from 'react';
import {
  ReactDecorator,
  ReactDecoratorModule,
  ReactFixture,
} from 'react-cosmos-core';
import { FixtureCapture } from '../client/FixtureCapture/FixtureCapture.js';
import { decorateFixture } from './decorateFixture.js';
import { createFixtureNode } from './fixtureNode.js';

type Props = {
  fixture: ReactFixture;
  userDecoratorModules: ReactDecoratorModule[];
  globalDecorators?: ReactDecorator[];
};
export function DecoratedFixture({
  fixture,
  userDecoratorModules,
  globalDecorators = noDecorators,
}: Props) {
  return useMemo(() => {
    const decorators = [
      ...globalDecorators,
      ...userDecoratorModules.map(m => m.default),
    ];
    return decorateFixture(
      <FixtureCapture decoratorId="root">
        {createFixtureNode(fixture)}
      </FixtureCapture>,
      decorators
    );
  }, [fixture, globalDecorators, userDecoratorModules]);
}

const noDecorators: ReactDecorator[] = [];
