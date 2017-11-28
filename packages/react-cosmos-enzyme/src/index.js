// @flow

import { mount as mountEnzyme } from 'enzyme';
import { importModule } from 'react-cosmos-shared';
import { moduleExists } from 'react-cosmos-shared/lib/server';
import { getCosmosConfig } from 'react-cosmos-config';
import { createContext as createGenericContext } from 'react-cosmos-loader';

import type { ComponentType } from 'react';
import type { Config } from 'react-cosmos-config/src';
import type {
  Wrapper,
  Proxy,
  Renderer,
  ContextArgs,
  ContextFunctions
} from 'react-cosmos-loader/src/types';

type Selector = string | ComponentType<*>;

// eslint-disable-next-line no-undef
type SpecificContextArgs = $Diff<ContextArgs, { renderer: Renderer }>;
export type EnzymeContextArgs = SpecificContextArgs & {
  cosmosConfigPath?: string
};

type EnzymeWrapper = Wrapper & {
  find: (selector: ?Selector) => EnzymeWrapper
};

type EnzymeContextFunctions = ContextFunctions & {
  getRootWrapper: () => EnzymeWrapper,
  getWrapper: (selector: ?Selector) => EnzymeWrapper
};

export function createContext(args: EnzymeContextArgs): EnzymeContextFunctions {
  const { proxies = detectUserProxies(args.cosmosConfigPath) } = args;
  const context = createGenericContext({
    ...args,
    renderer: mountEnzyme,
    proxies
  });
  const { getWrapper } = context;

  function getRootWrapper() {
    const wrapper = getWrapper();
    // Always keep wrapper up to date
    wrapper.update();

    return wrapper;
  }

  return {
    ...context,
    getRootWrapper,
    getWrapper: (selector: ?Selector) => {
      const { fixture } = args;
      const innerWrapper = getRootWrapper().find(fixture.component);

      return selector ? innerWrapper.find(selector) : innerWrapper;
    }
  };
}

function detectUserProxies(cosmosConfigPath): Array<Proxy> {
  const cosmosConfig: Config = getCosmosConfig(cosmosConfigPath);
  const { proxiesPath } = cosmosConfig;
  const userProxies = moduleExists(proxiesPath)
    ? importModule(require(proxiesPath))
    : [];

  return userProxies;
}
