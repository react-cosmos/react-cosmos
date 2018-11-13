// @flow

import React from 'react';
import { StateMock } from '@react-mock/state';
import { uuid } from '../../shared/uuid';
import { Counter } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <StateMock state={{ count: 5 }}>
        <Counter />
      </StateMock>
    </>
  )
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('transitions Fragment from single to multi children', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        renderer.update(
          getElement({
            rendererId,
            fixtures: {
              // This is a very tricky case. When fragments have one child,
              // props.children will be that child. But when fragments have
              // two or more children, props.children will be an array. When
              // transitioning from one Fragment child to more (or viceversa)
              // the first child's path changes
              //   - from: props.children
              //   - to: props.children[0]
              // This leads to a messy situation if we don't do proper cleanup.
              first: (
                <>
                  <StateMock state={{ count: 5 }}>
                    <Counter />
                  </StateMock>
                  <StateMock state={{ count: 10 }}>
                    <Counter />
                  </StateMock>
                </>
              )
            }
          })
        );

        // Do not remove this line: It captures a regression regarding an error
        // that occurred when component state was read asynchronously
        await new Promise(res => setTimeout(res, 500));

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              components: [
                createCompFxState({
                  props: [],
                  state: createFxValues({ count: 5 })
                }),
                createCompFxState({
                  props: [],
                  state: createFxValues({ count: 10 })
                })
              ]
            }
          }
        });
      });
    });
  });
}
