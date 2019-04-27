// These generic types keep Cosmos slightly more decoupled from React
type FixtureMap<FixtureType> = { [fixtureName: string]: FixtureType };
type FixtureExport<FixtureType> = FixtureType | FixtureMap<FixtureType>;

export type ReactFixtureMap = FixtureMap<React.ReactNode>;
export type ReactFixtureExport = FixtureExport<React.ReactNode>;
export type ReactDecorator = React.ComponentType<{ children: React.ReactNode }>;

type ModuleByPath<ModuleType> = {
  [path: string]: ModuleType;
};

export type ReactFixturesByPath = ModuleByPath<ReactFixtureExport>;
export type ReactDecoratorsByPath = ModuleByPath<ReactDecorator>;
