// @flow

export function getCommonDir(paths: Array<string>): string {
  const commonParts = [];

  paths.forEach((p, index) => {
    if (index === 0) {
      commonParts.push(...getDir(p).split('/'));
    } else {
      while (p.indexOf(commonParts.join('/')) !== 0) {
        commonParts.pop();
      }
    }
  });

  return commonParts.join('/');
}

export function getDir(p: string) {
  return p
    .split('/')
    .slice(0, -1)
    .join('/');
}
