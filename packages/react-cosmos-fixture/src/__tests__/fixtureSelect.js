// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: 'First',
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
            fixturePath: 'second',
            fixtureState: null
          });

          expect(renderer.toJSON()).toBe('Second');
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
            fixturePath: 'second',
            fixtureState: null
          });

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixturePath: 'second',
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
              fixturePath: 'second',
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
            fixturePath: 'second',
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
            fixturePath: 'third',
            fixtureState: null
          });

          expect(renderer.toJSON()).toBe('Fixture path not found: third');
        }
      );
    });
  });
});
