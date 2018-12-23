// @flow

import { uuid } from 'react-cosmos-shared2/util';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

const rendererId = uuid();
const fixtures = { first: null, second: null };
const decorators = {};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('renders blank state message', async () => {
    await mockConnect(async ({ getElement }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          expect(renderer.toJSON()).toEqual('No fixture loaded.');
        }
      );
    });
  });

  it('posts ready response on mount', async () => {
    await mockConnect(async ({ getElement, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async () => {
          await untilMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures: ['first', 'second']
            }
          });
        }
      );
    });
  });

  it('posts ready response again on ping request', async () => {
    await mockConnect(async ({ getElement, untilMessage, postMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async () => {
          await untilMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures: ['first', 'second']
            }
          });

          await postMessage({
            type: 'pingRenderers'
          });

          await untilMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures: ['first', 'second']
            }
          });
        }
      );
    });
  });

  it('posts fixture list on "fixtures" prop change', async () => {
    await mockConnect(async ({ getElement, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await untilMessage({
            type: 'rendererReady',
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
              },
              decorators
            })
          );

          await untilMessage({
            type: 'fixtureListChange',
            payload: {
              rendererId,
              fixtures: ['first', 'second', 'third']
            }
          });
        }
      );
    });
  });
}
