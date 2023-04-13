import { ReactDecoratorModule, ReactFixtureModule } from '../reactTypes.js';

export type FixtureModules = {
  fixturePath: string;
  fixtureModule: ReactFixtureModule;
  decoratorModules: ReactDecoratorModule[];
};
