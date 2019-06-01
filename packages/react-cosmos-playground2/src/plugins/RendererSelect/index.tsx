import React from 'react';
import styled from 'styled-components';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/public';
import { RendererSelectSpec } from './public';

const { plug, register } = createPlugin<RendererSelectSpec>({
  name: 'rendererSelect'
});

plug('controlPanelRow', ({ pluginContext: { getMethodsOf } }) => {
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
              fontWeight: rendererId === primaryRendererId ? 'bold' : 'normal'
            }}
          >
            {rendererId}
          </small>
        </li>
      ))}
    </Container>
  );
});

export { register };

const Container = styled.ul`
  padding: 8px 12px;
  list-style: none;
`;
