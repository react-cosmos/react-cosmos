import { FixtureState, SetFixtureState } from '../fixtureState';

// These generic types keep Cosmos slightly more decoupled from React
type FixtureMap<FixtureType> = { [fixtureName: string]: FixtureType };
type FixtureExport<FixtureType> = FixtureType | FixtureMap<FixtureType>;

export type ReactFixtureMap = FixtureMap<React.ReactNode>;
export type ReactFixtureExport = FixtureExport<React.ReactNode>;

export type ReactDecoratorProps = {
  children: React.ReactNode;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  onErrorReset: () => unknown;
};
export type ReactDecorator = React.ComponentType<ReactDecoratorProps>;

type ModuleByPath<ModuleType> = {
  [path: string]: ModuleType;
};

export type ReactFixturesByPath = ModuleByPath<ReactFixtureExport>;
export type ReactDecoratorsByPath = ModuleByPath<ReactDecorator>;
