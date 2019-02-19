// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = { first: 'First' };
const decorators = {};

runTests(mockConnect => {
  it('fires change callback when selecting fixture', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      const onFixtureChange = jest.fn();
      await mount(
        getElement({ rendererId, fixtures, decorators, onFixtureChange }),
        async () => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'first', name: null },
            fixtureState: null
          });

          expect(onFixtureChange).toBeCalledTimes(1);
        }
      );
    });
  });

  it('fires change callback when unselecting fixture', async () => {
    await mockConnect(
      async ({ getElement, selectFixture, unselectFixture }) => {
        const onFixtureChange = jest.fn();
        await mount(
          getElement({ rendererId, fixtures, decorators, onFixtureChange }),
          async () => {
            await selectFixture({
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: null
            });
            await unselectFixture({ rendererId });

            expect(onFixtureChange).toBeCalledTimes(2);
          }
        );
      }
    );
  });
});
