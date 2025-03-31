import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { findNextAvailablePort } from '../shared/findNextAvailablePort.js';

export const portRetryPlugin: CosmosServerPlugin = {
  name: 'portRetry',

  async config({ cosmosConfig, mode }) {
    if (mode === 'export') {
      return cosmosConfig;
    }

    const { port, portRetries } = cosmosConfig;
    return {
      ...cosmosConfig,
      port: portRetries ? await findNextAvailablePort(port, portRetries) : port,
    };
  },
};
