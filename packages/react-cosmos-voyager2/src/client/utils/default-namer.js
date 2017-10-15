// @flow

/**
 * Generate unique, consecutive default names
 * E.g. default, default (1), default (2), etc.
 */
export function createDefaultNamer(baseName: string) {
  let count = 0;

  return function defaultNamer(): string {
    const name = count > 0 ? `${baseName} (${count})` : baseName;
    count += 1;

    return name;
  };
}
