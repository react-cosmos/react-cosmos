// @flow

import React, { Component } from 'react';
import { uuid } from '../../shared/uuid';
import { CaptureProps } from '../../CaptureProps';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

class HelloMessage extends Component<{ name?: string }> {
  render() {
    return `Hello ${this.props.name || 'Stranger'}`;
  }
}

function Wrap({ children }) {
  return children();
}

Wrap.cosmosCaptureProps = false;

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <Wrap>{() => <HelloMessage name="Bianca" />}</Wrap>
      <Wrap>
        {() => (
          <CaptureProps>
            <HelloMessage name="B" />
          </CaptureProps>
        )}
      </Wrap>
    </>
  )
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('captures props from render callback', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello B']);

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [getPropsInstanceShape({ name: 'B' })]
            }
          }
        });
      });
    });
  });
}

function getPropsInstanceShape({ name }) {
  return {
    decoratorId: expect.any(Number),
    componentName: 'HelloMessage',
    elPath: expect.any(String),
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        stringified: `"${name}"`
      }
    ]
  };
}
