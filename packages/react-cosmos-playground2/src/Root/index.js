// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Slot, PluginsConsumer } from 'react-plugin';
import { Section } from '../Section';

// Experimental plugin-based UI structure
export class Root extends Component<any> {
  render() {
    return (
      <Container>
        <Section label="Root">
          <PluginsConsumer>
            {({ plugins }) => (
              <>
                <Plugins plugins={plugins} />
                <Slot name="root">
                  <Slot name="preview" />
                </Slot>
              </>
            )}
          </PluginsConsumer>
        </Section>
      </Container>
    );
  }
}

function Plugins({ plugins }) {
  return (
    <PluginsContainer>
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
    </PluginsContainer>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-family: sans-serif;
  font-size: 16px;
  display: flex;
`;

const PluginsContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  padding: 16px 24px;
  line-height: 28px;

  ul {
    list-style: none;
    user-select: none;
  }
`;
