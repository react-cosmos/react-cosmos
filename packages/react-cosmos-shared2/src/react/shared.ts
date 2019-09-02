import { FixtureState, SetFixtureState } from '../fixtureState';

// These generic types keep Cosmos slightly more decoupled from React
type FixtureMap<FixtureType> = { [fixtureName: string]: FixtureType };
type FixtureExport<FixtureType> = FixtureType | FixtureMap<FixtureType>;

export type ReactFixture = React.ReactNode | React.FunctionComponent;
export type ReactFixtureMap = FixtureMap<ReactFixture>;
export type ReactFixtureExport = FixtureExport<ReactFixture>;

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

export type ReactFixtureExportsByPath = ModuleByPath<ReactFixtureExport>;
export type ReactDecoratorsByPath = ModuleByPath<ReactDecorator>;
