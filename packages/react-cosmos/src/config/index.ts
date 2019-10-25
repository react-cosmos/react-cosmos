import { CosmosConfig } from './shared';

// Types can't be re-exported because Babel (see root tsconfig.json)
export type CosmosConfig = CosmosConfig;

export { resolveModule } from './resolve';
export { createCosmosConfig } from './createCosmosConfig';
export { detectCosmosConfig } from './detectCosmosConfig';
export { getCosmosConfigAtPath } from './getCosmosConfigAtPath';
