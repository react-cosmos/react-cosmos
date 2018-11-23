// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

const rendererId = uuid();
const fixtures = { first: null, second: null };

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('renders blank state message', async () => {
    await mockConnect(async ({ getElement }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        expect(renderer.toJSON()).toEqual('No fixture loaded.');
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
      await mount(getElement({ rendererId, fixtures }), async () => {
        await untilMessage({
          type: 'fixtureList',
          payload: {
            rendererId,
            fixtures: ['first', 'second']
          }
        });

        await postMessage({
          type: 'requestFixtureList'
        });

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

  it('posts fixture list again on "fixtures" prop change', async () => {
    await mockConnect(async ({ getElement, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        await untilMessage({
          type: 'fixtureList',
          payload: {
            rendererId,
            fixtures: ['first', 'second']
          }
        });

        renderer.update(
          getElement({
            rendererId,
            fixtures: {
              ...fixtures,
              third: null
            }
          })
        );

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
