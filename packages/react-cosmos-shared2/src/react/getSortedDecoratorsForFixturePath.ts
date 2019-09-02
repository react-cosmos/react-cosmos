import { ReactDecoratorsByPath, ReactDecorator } from './shared';

export function getSortedDecoratorsForFixturePath(
  decoratorsByPath: ReactDecoratorsByPath,
  fixturePath: string
): ReactDecorator[] {
  return getSortedDecorators(
    getDecoratorsForFixturePath(decoratorsByPath, fixturePath)
  );
}

function getDecoratorsForFixturePath(
  decoratorsByPath: ReactDecoratorsByPath,
  fixturePath: string
) {
  return Object.keys(decoratorsByPath)
    .filter(dPath => fixturePath.indexOf(`${getParentPath(dPath)}/`) === 0)
    .reduce((acc, dPath) => ({ ...acc, [dPath]: decoratorsByPath[dPath] }), {});
}

function getParentPath(nestedPath: string) {
  // Remove everything right of the right-most forward slash, or return an
  // empty string if path has no forward slash
  return nestedPath.replace(/^((.+)\/)?.+$/, '$2');
}

function getSortedDecorators(
  decoratorsByPath: ReactDecoratorsByPath
): ReactDecorator[] {
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
