// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: { one: 'First' },
  second: 'Second'
};

runTests(mockConnect => {
  it('renders selected fixture', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators: {} }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'second', name: null },
            fixtureState: null
          });

          expect(renderer.toJSON()).toBe('Second');
        }
      );
    });
  });

  it('renders selected named fixture', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators: {} }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'first', name: 'one' },
            fixtureState: null
          });

          expect(renderer.toJSON()).toBe('First');
        }
      );
    });
  });

  it('creates empty fixture state', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators: {} }),
        async () => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'second', name: null },
            fixtureState: null
          });

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixtureId: { path: 'second', name: null },
              fixtureState: {
                components: []
              }
            }
          });
        }
      );
    });
  });

  it('renders blank state after unselecting fixture', async () => {
    await mockConnect(
      async ({ getElement, selectFixture, unselectFixture }) => {
        await mount(
          getElement({ rendererId, fixtures, decorators: {} }),
          async renderer => {
            await selectFixture({
              rendererId,
              fixtureId: { path: 'second', name: null },
              fixtureState: null
            });

            await unselectFixture({
              rendererId
            });

            expect(renderer.toJSON()).toBe('No fixture loaded.');
          }
        );
      }
    );
  });

  it('ignores "selectFixture" message for different renderer', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators: {} }),
        async renderer => {
          await selectFixture({
            rendererId: 'foobar',
            fixtureId: { path: 'second', name: null },
            fixtureState: null
          });

          expect(renderer.toJSON()).toBe('No fixture loaded.');
        }
      );
    });
  });

  it('renders missing state on unknown fixture path', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators: {} }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'third', name: null },
            fixtureState: null
          });

          expect(renderer.toJSON()).toBe('Fixture path not found: third');
        }
      );
    });
  });
});
