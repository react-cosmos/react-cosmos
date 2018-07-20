// @flow

import React, { Component, Fragment } from 'react';
import { Slot, PluginsConsumer } from 'react-plugin';

// Experimental plugin-based UI structure
// TODO: Add some CSS
export class Root extends Component<any> {
  render() {
    return (
      <PluginsConsumer>
        {({ plugins }) => (
          <Fragment>
            <ul>
              {plugins.map(({ id, name, enabled, enable, disable }) => (
                <li key={id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => (enabled ? disable() : enable())}
                    />{' '}
                    {name}
                  </label>
                </li>
              ))}
            </ul>
            <Slot name="root">
              <Slot name="preview" />
            </Slot>
          </Fragment>
        )}
      </PluginsConsumer>
    );
  }
}
