import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { findNextAvailablePort } from '../shared/findNextAvailablePort.js';

export const portRetryServerPlugin: CosmosServerPlugin = {
  name: 'portRetry',

  async config({ cosmosConfig }) {
    const { port, portRetries } = cosmosConfig;
    return {
      ...cosmosConfig,
      port: portRetries ? await findNextAvailablePort(port, portRetries) : port,
    };
  },
};
