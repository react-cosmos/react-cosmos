import type { FixtureId } from '../userModules/fixtureTypes.js';

export type RendererParams = {
  fixtureId?: FixtureId;
  // The renderer stays on the selected fixture but still syncs fixture state
  // with the Cosmos UI. Used by the full-screen preview.
  locked?: boolean;
  // The renderer is disconnected from the Cosmos UI and the dev server and
  // only responds to window hooks. Used by visual test runners.
  detached?: boolean;
};
