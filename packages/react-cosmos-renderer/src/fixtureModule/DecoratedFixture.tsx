import React, { useMemo } from 'react';
import {
  ReactDecorator,
  ReactDecoratorModule,
  ReactFixture,
} from 'react-cosmos-core';
import { FixtureCapture } from '../fixture/FixtureCapture/FixtureCapture.js';
import { createFixtureNode } from './createFixtureNode.js';
import { decorateFixture } from './decorateFixture.js';

type Props = {
  fixture: ReactFixture;
  fixtureOptions: {};
  fixtureProps?: Record<string, unknown>;
  userDecoratorModules: ReactDecoratorModule[];
  globalDecorators?: ReactDecorator[];
};
export function DecoratedFixture({
  fixture,
  fixtureOptions,
  fixtureProps,
  userDecoratorModules,
  globalDecorators = [],
}: Props) {
  return useMemo(() => {
    const decorators = [
      ...globalDecorators,
      ...userDecoratorModules.map(m => m.default).flat(),
    ];
    return decorateFixture(
      <FixtureCapture decoratorId="root">
        {createFixtureNode(fixture, fixtureProps)}
      </FixtureCapture>,
      fixtureOptions,
      decorators
    );
  }, [
    fixture,
    fixtureOptions,
    fixtureProps,
    globalDecorators,
    userDecoratorModules,
  ]);
}
