// @flow

import traverse from 'traverse';
import { importModule } from 'react-cosmos-shared';
import { moduleExists } from 'react-cosmos-shared/lib/server';
import { getCosmosConfig } from 'react-cosmos-config';
import { createContext as createLoaderContext } from 'react-cosmos-loader';

import type { ComponentType } from 'react';
import type { Config } from 'react-cosmos-flow/config';
import type { FixtureType } from 'react-cosmos-flow/fixture';
import type { Proxy } from 'react-cosmos-flow/proxy';
import type {
  ContextFunctions,
  TestContextArgs
} from 'react-cosmos-flow/context';

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

function decorateFixture<P: {}, C: ComponentType<P>>(
  fixture: FixtureType<P, C>
): FixtureType<P, C> {
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

function addJestWrapper(prop: any): Function {
  // HIGHLY EXPERIMENTAL: This is likely to go away if it causes problems. But,
  // in the meantime, as Louie would say, "Weeeee!". This makes it possible to
  // do expect(fixture.props.*).toHaveBeenCalled in Jest without wrapping any
  // callback with jest.fn() by had.
  // eslint-disable-next-line no-undef
  return isFunctionButNotClass(prop) ? jest.fn(prop) : prop;
}

function isFunctionButNotClass(prop: any): boolean {
  // Inspired from https://stackoverflow.com/a/32235930
  return (
    typeof prop === 'function' &&
    !/^(?:class\s+|function\s+(?:_class|_default|[A-Z]))/.test(prop.toString())
  );
}
