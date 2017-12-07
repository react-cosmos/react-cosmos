// @flow

import traverse from 'traverse';
import { importModule } from 'react-cosmos-shared';
import { moduleExists } from 'react-cosmos-shared/lib/server';
import { getCosmosConfig } from 'react-cosmos-config';
import { createContext as createLoaderContext } from 'react-cosmos-loader';

import type { Config } from 'react-cosmos-config/src';
import type {
  Proxy,
  Fixture,
  ContextArgs,
  ContextFunctions
} from 'react-cosmos-loader/src/types';

export type TestContextArgs = ContextArgs & {
  cosmosConfigPath?: string
};

export function createContext(args: TestContextArgs): ContextFunctions {
  const { fixture, proxies = detectUserProxies(args.cosmosConfigPath) } = args;
  const decoratedFixture = decorateFixture(fixture);

  return createLoaderContext({
    ...args,
    proxies,
    fixture: decoratedFixture
  });
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
