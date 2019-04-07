import { FixturesByPath, DecoratorsByPath } from 'react-cosmos-fixture';
import { DomRendererConfig } from '../../../domRenderer';
import { initErrorOverlay, dismissErrorOverlay } from './errorOverlay';

export type DomRendererData = {
  rendererConfig: DomRendererConfig;
  fixtures: FixturesByPath;
  decorators: DecoratorsByPath;
};

// NOTE: Renderer data is statically injected at compile time
declare var __COSMOS_DATA: DomRendererData;

const rendererData = __COSMOS_DATA;
const { rendererConfig, fixtures, decorators } = rendererData;

function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  require('../../../domRenderer').mountDomRenderer({
    rendererConfig,
    fixtures,
    decorators,
    onFixtureChange: dismissErrorOverlay
  });
}

initErrorOverlay();
mount();

if ((module as any).hot) {
  (module as any).hot.accept('../../../domRenderer', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own
    dismissErrorOverlay();
    mount();
  });
}
