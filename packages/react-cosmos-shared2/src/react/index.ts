import {
  ReactFixture,
  ReactFixtureMap,
  ReactFixtureExport,
  ReactDecoratorProps,
  ReactDecorator,
  ReactFixtureExportsByPath,
  ReactDecoratorsByPath
} from './shared';

// Types can't be re-exported because Babel (see root tsconfig.json)
export type ReactFixture = ReactFixture;
export type ReactFixtureMap = ReactFixtureMap;
export type ReactFixtureExport = ReactFixtureExport;
export type ReactDecoratorProps = ReactDecoratorProps;
export type ReactDecorator = ReactDecorator;
export type ReactFixtureExportsByPath = ReactFixtureExportsByPath;
export type ReactDecoratorsByPath = ReactDecoratorsByPath;

export { areNodesEqual } from './areNodesEqual';
export { isMultiFixture } from './isMultiFixture';
export { getFixtureNamesByPath } from './getFixtureNamesByPath';
export {
  getSortedDecoratorsForFixturePath
} from './getSortedDecoratorsForFixturePath';
