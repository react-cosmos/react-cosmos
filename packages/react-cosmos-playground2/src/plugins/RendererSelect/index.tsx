import React from 'react';
import { RendererCoreSpec, RendererSelectSpec } from 'react-cosmos-shared2/ui';
import { createPlugin } from 'react-plugin';
import styled from 'styled-components';

const { plug, register } = createPlugin<RendererSelectSpec>({
  name: 'rendererSelect',
});

plug('sidePanelRow', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const primaryRendererId = rendererCore.getPrimaryRendererId();
  const connectedRendererIds = rendererCore.getConnectedRendererIds();

  if (!primaryRendererId) {
    return null;
  }

  return (
    <Container>
      {connectedRendererIds.map(rendererId => (
        <li key={rendererId}>
          <small
            onClick={() => rendererCore.selectPrimaryRenderer(rendererId)}
            style={{
              cursor: 'pointer',
              fontWeight: rendererId === primaryRendererId ? 'bold' : 'normal',
            }}
          >
            {rendererId}
          </small>
        </li>
      ))}
    </Container>
  );
});

register();

const Container = styled.ul`
  padding: 8px 12px;
  list-style: none;
`;
