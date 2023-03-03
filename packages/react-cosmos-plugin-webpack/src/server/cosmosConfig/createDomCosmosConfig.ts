import { CosmosConfig } from 'react-cosmos/server.js';

type DomCosmosConfig = {
  containerQuerySelector: null | string;
};

type DomCosmosConfigInput = Partial<DomCosmosConfig>;

export function createDomCosmosConfig(
  cosmosConfig: CosmosConfig
): DomCosmosConfig {
  const configInput = (cosmosConfig.dom || {}) as DomCosmosConfigInput;
  return {
    containerQuerySelector: getContainerQuerySelector(configInput),
  };
}

function getContainerQuerySelector({
  containerQuerySelector = null,
}: DomCosmosConfigInput) {
  return containerQuerySelector;
}
