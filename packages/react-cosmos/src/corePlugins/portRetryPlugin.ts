import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { findNextAvailablePort } from '../shared/findNextAvailablePort.js';

export const portRetryPlugin: CosmosServerPlugin = {
  name: 'portRetry',

  async config({ config, mode }) {
    if (mode === 'export') {
      return config;
    }

    const { port, portRetries } = config;
    return {
      ...config,
      port: portRetries ? await findNextAvailablePort(port, portRetries) : port,
    };
  },
};
