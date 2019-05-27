import React from 'react';
import styled from 'styled-components';
import { createPlugin, PluginsConsumer } from 'react-plugin';
import { PluginListSpec } from './public';

const { plug, register } = createPlugin<PluginListSpec>({
  name: 'pluginList'
});

plug('controlPanelRow', () => {
  return (
    <Container>
      <p>Plugins</p>
      <ul>
        <PluginsConsumer>
          {({ plugins, enable }) =>
            plugins.map(({ name, enabled }) => (
              <li key={name}>
                <label
                  onMouseDown={() => {
                    enable(name, !enabled);
                  }}
                >
                  <input type="checkbox" checked={enabled} readOnly /> {name}
                </label>
              </li>
            ))
          }
        </PluginsConsumer>
      </ul>
    </Container>
  );
});

export { register };

const Container = styled.div`
  padding: 8px 12px;

  ul {
    list-style: none;
  }
`;
