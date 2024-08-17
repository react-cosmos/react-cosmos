import { ComponentType, ReactNode } from 'react';

type FixtureMap<FixtureType> = { [fixtureName: string]: FixtureType };
type FixtureExport<FixtureType> = FixtureType | FixtureMap<FixtureType>;
type FixtureModule<FixtureType> = {
  default: FixtureExport<FixtureType>;
  options?: {};
};

type ModuleWrapper<ModuleType> = { module: ModuleType };
type LazyModuleWrapper<ModuleType> = { getModule: () => Promise<ModuleType> };

export type ReactFixture = ReactNode | ComponentType;
export type ReactFixtureMap = FixtureMap<ReactFixture>;
export type ReactFixtureExport = FixtureExport<ReactFixture>;
export type ReactFixtureModule = FixtureModule<ReactFixture>;
export type ReactFixtureWrapper = ModuleWrapper<ReactFixtureModule>;
export type LazyReactFixtureWrapper = LazyModuleWrapper<ReactFixtureModule>;

export type DecoratorProps<T = {}> = {
  children: ReactNode;
  options: T;
};
export type ReactDecorator<T = {}> = ComponentType<DecoratorProps<T>>;
export type ReactDecoratorModule = { default: ReactDecorator<any> };
export type ReactDecoratorWrapper = ModuleWrapper<ReactDecoratorModule>;
export type LazyReactDecoratorWrapper = LazyModuleWrapper<ReactDecoratorModule>;

export type ByPath<T> = Record<string, T>;

export type UserModuleWrappers =
  | {
      lazy: true;
      fixtures: ByPath<LazyReactFixtureWrapper>;
      decorators: ByPath<LazyReactDecoratorWrapper>;
    }
  | {
      lazy: false;
      fixtures: ByPath<ReactFixtureWrapper>;
      decorators: ByPath<ReactDecoratorWrapper>;
    };

export type FixtureModules = {
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
};
