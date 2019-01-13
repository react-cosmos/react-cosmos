// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

const rendererId = uuid();
const fixtures = { first: 'First' };
const decorators = {};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('fires change callback when selecting fixture', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      const onFixtureChange = jest.fn();
      await mount(
        getElement({ rendererId, fixtures, decorators, onFixtureChange }),
        async () => {
          await selectFixture({
            rendererId,
            fixturePath: 'first',
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
              fixturePath: 'first',
              fixtureState: null
            });
            await unselectFixture({ rendererId });

            expect(onFixtureChange).toBeCalledTimes(2);
          }
        );
      }
    );
  });
}
