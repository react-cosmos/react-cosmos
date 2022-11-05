import { ComponentType, FunctionComponent, ReactNode } from 'react';
import { FixtureState, SetFixtureState } from '../fixtureState/types.js';

// These generic types keep Cosmos slightly more decoupled from React
type FixtureMap<FixtureType> = { [fixtureName: string]: FixtureType };
type FixtureExport<FixtureType> = FixtureType | FixtureMap<FixtureType>;
type FixtureModule<FixtureType> = { default: FixtureExport<FixtureType> };
type FixtureWrapper<FixtureType> = { module: FixtureModule<FixtureType> };

export type ReactFixture = ReactNode | FunctionComponent;
export type ReactFixtureMap = FixtureMap<ReactFixture>;
export type ReactFixtureExport = FixtureExport<ReactFixture>;
export type ReactFixtureModule = FixtureModule<ReactFixture>;
export type ReactFixtureWrapper = FixtureWrapper<ReactFixture>;

export type ReactDecoratorProps = {
  children: ReactNode;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  onErrorReset: () => unknown;
};
export type ReactDecorator = ComponentType<ReactDecoratorProps>;

export type ReactFixtureExports = Record<string, ReactFixtureExport>;
export type ReactFixtureWrappers = Record<string, ReactFixtureWrapper>;
export type ReactDecorators = Record<string, ReactDecorator>;
