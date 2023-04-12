import {
  LazyReactDecoratorWrapper,
  LazyReactDecoratorWrappersByPath,
} from './reactTypes.js';

export function getSortedLazyDecoratorsForFixturePath(
  fixturePath: string,
  decoratorsByPath: LazyReactDecoratorWrappersByPath
): LazyReactDecoratorWrapper[] {
  return getSortedDecorators(
    getDecoratorsForFixturePath(decoratorsByPath, fixturePath)
  );
}

function getDecoratorsForFixturePath(
  decoratorsByPath: LazyReactDecoratorWrappersByPath,
  fixturePath: string
) {
  return Object.keys(decoratorsByPath)
    .filter(dPath => isParentDir(getParentPath(dPath), fixturePath))
    .reduce((acc, dPath) => ({ ...acc, [dPath]: decoratorsByPath[dPath] }), {});
}

function isParentDir(parentPath: string, filePath: string) {
  return parentPath === '' || filePath.indexOf(`${parentPath}/`) === 0;
}

function getParentPath(nestedPath: string) {
  // Remove everything right of the right-most forward slash, or return an
  // empty string if path has no forward slash
  return nestedPath.replace(/^((.+)\/)?.+$/, '$2');
}

function getSortedDecorators(
  decoratorsByPath: LazyReactDecoratorWrappersByPath
): LazyReactDecoratorWrapper[] {
  return sortPathsByDepthAsc(Object.keys(decoratorsByPath)).map(
    decoratorPath => decoratorsByPath[decoratorPath]
  );
}

function sortPathsByDepthAsc(paths: string[]) {
  return [...paths].sort(
    (a, b) =>
      getPathNestingLevel(a) - getPathNestingLevel(b) || a.localeCompare(b)
  );
}

function getPathNestingLevel(path: string) {
  return path.split('/').length;
}
