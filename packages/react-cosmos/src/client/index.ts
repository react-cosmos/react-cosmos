import { FixturesByPath, DecoratorsByPath } from 'react-cosmos-fixture';
import { RendererConfig } from '../shared';
import { initErrorOverlay, dismissErrorOverlay } from './errorOverlay';

// TODO: Merge injected config with modules
declare var RENDERER_CONFIG: RendererConfig;
declare var __COSMOS_MODULES: {
  fixtures: FixturesByPath;
  decorators: DecoratorsByPath;
};

// NOTE: Renderer config is injected at compile-time
export const rendererConfig: RendererConfig = RENDERER_CONFIG;

// NOTE: Cosmos modules are statically injected at compile time
const cosmosModules = __COSMOS_MODULES;

const { fixtures, decorators } = cosmosModules;

function mount() {
  // Use dynamic import to load updated modules upon hot reloading
  require('../dom').mount({
    rendererConfig,
    fixtures,
    decorators,
    onFixtureChange: dismissErrorOverlay
  });
}

initErrorOverlay();
mount();

if ((module as any).hot) {
  (module as any).hot.accept('../dom', () => {
    // If a previous error has been solved, the error overlay auto-closes nicely.
    // If the error persists, however, the overlay will pop up again on its own
    dismissErrorOverlay();
    mount();
  });
}
