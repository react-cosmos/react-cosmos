export { getCosmosConfig, createCosmosConfig } from './config';
export { findUserModulePaths, getFixtureNames } from './shared/userDeps';

// Other potential APIs:
// - getFixturesByPath() - Server-side API for getting all fixture modules.
//     NOTE: Decorators need to also be taken into consideration for this API
//     to be useful. Rendering a fixture without its decorators is invalid. And
//     the per-fixture decorator resolution logic is currently kept inside the
//     react-cosmos-fixture/FixtureLoader component. An additional data
//     structure that maps relevant decorators per fixture path might be useful
//     here. Or a higher level API for rendering a fixture by path.
