import React from 'react';
import { ReactDecorators, ReactFixtureWrappers } from 'react-cosmos-core';
import { createRoot } from 'react-dom/client';
import { DomFixtureLoader } from './DomFixtureLoader.js';
import { getDomContainer } from './getDomContainer.js';
import { DomRendererConfig } from './types.js';

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
      playgroundUrl={rendererConfig.playgroundUrl}
      onErrorReset={onErrorReset}
    />
  );
}
