// @flow

import traverse from 'traverse';
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
  Fixture,
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
  const { fixture, proxies = detectUserProxies(args.cosmosConfigPath) } = args;
  const decoratedFixture = decorateFixture(fixture);

  const context = createGenericContext({
    ...args,
    renderer: mountEnzyme,
    proxies,
    fixture: decoratedFixture
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

function decorateFixture(fixture: Fixture): Fixture {
  if (!inJestEnv() || !fixture.props) {
    return fixture;
  }

  return {
    ...fixture,
    props: traverse.map(fixture.props, addJestWrapper)
  };
}

function inJestEnv() {
  try {
    jest.fn(); // eslint-disable-line no-undef
    return true;
  } catch (err) {
    return false;
  }
}

function addJestWrapper(fn: Function): Function {
  // HIGHLY EXPERIMENTAL: This is likely to go away if it causes problems. But,
  // in the meantime, as Louie would say, "Weeeee!". This makes it possible to
  // do expect(fixture.props.*).toHaveBeenCalled in Jest without wrapping any
  // callback with jest.fn() by had.
  // eslint-disable-next-line no-undef
  return isFunctionButNotClass(fn) ? jest.fn(fn) : fn;
}

function isFunctionButNotClass(fn: Function): boolean {
  // Inspired from https://stackoverflow.com/a/32235930
  return (
    typeof fn === 'function' &&
    !/^(?:class\s+|function\s+(?:_class|_default|[A-Z]))/.test(fn.toString())
  );
}
