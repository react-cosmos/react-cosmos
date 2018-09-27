// @flow

import React, { Component } from 'react';
import { StateMock } from '@react-mock/state';
import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    const { count } = this.state;

    return typeof count === 'number' ? `${count} times` : 'Missing count';
  }
}

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

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [
                getEmptyPropsInstanceShape(),
                getEmptyPropsInstanceShape()
              ],
              state: [getStateInstanceShape(5), getStateInstanceShape(10)]
            }
          }
        });
      });
    });
  });
}

function getEmptyPropsInstanceShape() {
  return {
    decoratorId: expect.any(Number),
    elPath: expect.any(String),
    componentName: 'Counter',
    renderKey: expect.any(Number),
    values: []
  };
}

function getStateInstanceShape(count: number) {
  return {
    decoratorId: expect.any(Number),
    elPath: expect.any(String),
    componentName: 'Counter',
    values: [
      {
        serializable: true,
        key: 'count',
        stringified: `${count}`
      }
    ]
  };
}
