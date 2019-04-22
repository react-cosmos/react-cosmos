import { CosmosConfig } from '../../../config';

type DomCosmosConfig = {
  containerQuerySelector: null | string;
};

type DomCosmosConfigInput = Partial<DomCosmosConfig>;

export function createDomCosmosConfig(
  cosmosConfig: CosmosConfig
): DomCosmosConfig {
  const domCosmosConfigInput = (cosmosConfig.dom || {}) as DomCosmosConfigInput;
  return {
    containerQuerySelector: getContainerQuerySelector(domCosmosConfigInput)
  };
}

function getContainerQuerySelector({
  containerQuerySelector = null
}: DomCosmosConfigInput) {
  return containerQuerySelector;
}
