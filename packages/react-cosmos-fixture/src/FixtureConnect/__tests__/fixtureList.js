// @flow

import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

const rendererId = uuid();
const fixtures = { first: null, second: null };

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('renders blank state message', async () => {
    await mockConnect(async ({ getElement }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        expect(instance.toJSON()).toEqual('No fixture loaded.');
      });
    });
  });

  it('posts fixture list on mount', async () => {
    await mockConnect(async ({ getElement, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async () => {
        await untilMessage({
          type: 'fixtureList',
          payload: {
            rendererId,
            fixtures: ['first', 'second']
          }
        });
      });
    });
  });

  it('posts fixture list again on request', async () => {
    await mockConnect(async ({ getElement, untilMessage, postMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await untilMessage({
          type: 'fixtureList',
          payload: {
            rendererId,
            fixtures: ['first', 'second']
          }
        });

        instance.update(
          getElement({
            rendererId,
            fixtures: {
              ...fixtures,
              third: null
            }
          })
        );

        await postMessage({
          type: 'requestFixtureList'
        });

        await untilMessage({
          type: 'fixtureList',
          payload: {
            rendererId,
            fixtures: ['first', 'second', 'third']
          }
        });
      });
    });
  });
}
