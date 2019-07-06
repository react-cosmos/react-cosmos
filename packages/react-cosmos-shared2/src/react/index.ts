import {
  ReactFixtureMap,
  ReactFixtureExport,
  ReactDecoratorProps,
  ReactDecorator,
  ReactFixturesByPath,
  ReactDecoratorsByPath
} from './shared';

// Types can't be re-exported because Babel (see root tsconfig.json)
export type ReactFixtureMap = ReactFixtureMap;
export type ReactFixtureExport = ReactFixtureExport;
export type ReactDecoratorProps = ReactDecoratorProps;
export type ReactDecorator = ReactDecorator;
export type ReactFixturesByPath = ReactFixturesByPath;
export type ReactDecoratorsByPath = ReactDecoratorsByPath;

export { areNodesEqual } from './areNodesEqual';
export { isMultiFixture } from './isMultiFixture';
export { getFixtureNames } from './getFixtureNames';
