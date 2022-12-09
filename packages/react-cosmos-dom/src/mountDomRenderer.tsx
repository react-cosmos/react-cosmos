import React from 'react';
import { ReactDecorators, ReactFixtureWrappers } from 'react-cosmos-core';
import { createRoot } from 'react-dom/client';
import { DomFixtureLoader } from './DomFixtureLoader.js';
import { domRendererConnect } from './domRendererConnect.js';
import { domRendererId } from './domRendererId.js';
import { getDomContainer } from './getDomContainer.js';
import { DomRendererConfig } from './types.js';

window.addEventListener('error', () => {
  domRendererConnect.postMessage({
    type: 'rendererError',
    payload: { rendererId: domRendererId },
  });
});

type CachedRoot = {
  domContainer: Element;
  reactRoot: ReturnType<typeof createRoot>;
};
let cachedRoot: CachedRoot | null = null;

type Args = {
  rendererConfig: DomRendererConfig;
  fixtures: ReactFixtureWrappers;
  decorators: ReactDecorators;
  onErrorReset?: () => unknown;
};
export function mountDomRenderer({
  rendererConfig,
  fixtures,
  decorators,
  onErrorReset,
}: Args) {
  const domContainer = getDomContainer(rendererConfig.containerQuerySelector);
  if (!cachedRoot || cachedRoot.domContainer !== domContainer) {
    const reactRoot = createRoot(domContainer);
    cachedRoot = { domContainer, reactRoot };
  }

  cachedRoot.reactRoot.render(
    <DomFixtureLoader
      fixtures={fixtures}
      decorators={decorators}
      onErrorReset={onErrorReset}
    />
  );
}
