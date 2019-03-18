import * as React from 'react';
import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-shared2/util';
import { runFixtureConnectTests } from '../testHelpers';
import { anyProps } from '../testHelpers/fixtureState';
import { Viewport } from '..';

const rendererId = uuid();
const fixtures = {
  first: (
    <Viewport width={320} height={240}>
      yo
    </Viewport>
  )
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('renders children', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await retry(() => expect(renderer.toJSON()).toBe('yo'));
      }
    );
  });

  it('creates viewport fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: [anyProps()],
            viewport: { width: 320, height: 240 }
          }
        });
      }
    );
  });
});
