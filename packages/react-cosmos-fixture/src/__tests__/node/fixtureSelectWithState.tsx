import * as React from 'react';
import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-shared2/util';
import {
  createValues,
  createFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { HelloMessage } from '../../testHelpers/components';
import { runFixtureLoaderTests } from '../../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Bianca" />
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureLoaderTests(mount => {
  it('renders selected fixture with fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {
            props: createFixtureStateProps({
              fixtureState: {},
              elementId: { decoratorId: 'root', elPath: '' },
              values: createValues({ name: 'B' }),
              componentName: 'HelloMessage'
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
      }
    );
  });
});
