import React from 'react';
import { UserModuleWrappers } from 'react-cosmos-core';
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
  moduleWrappers: UserModuleWrappers;
  onErrorReset?: () => unknown;
};
export function mountDomRenderer({
  rendererConfig,
  moduleWrappers,
  onErrorReset,
}: Args) {
  const domContainer = getDomContainer(rendererConfig.containerQuerySelector);
  if (!cachedRoot || cachedRoot.domContainer !== domContainer) {
    const reactRoot = createRoot(domContainer);
    cachedRoot = { domContainer, reactRoot };
  }

  cachedRoot.reactRoot.render(
    <DomFixtureLoader
      moduleWrappers={moduleWrappers}
      playgroundUrl={rendererConfig.playgroundUrl}
      onErrorReset={onErrorReset}
    />
  );
}
