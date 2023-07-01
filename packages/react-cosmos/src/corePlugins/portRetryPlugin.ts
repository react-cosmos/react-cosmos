import { CosmosBuildPlugin } from '../cosmosPlugin/types.js';
import { findNextAvailablePort } from '../shared/findNextAvailablePort.js';

export const portRetryPlugin: CosmosBuildPlugin = {
  name: 'portRetry',

  async config({ cosmosConfig, command }) {
    if (command === 'export') {
      return cosmosConfig;
    }

    const { port, portRetries } = cosmosConfig;
    return {
      ...cosmosConfig,
      port: portRetries ? await findNextAvailablePort(port, portRetries) : port,
    };
  },
};
