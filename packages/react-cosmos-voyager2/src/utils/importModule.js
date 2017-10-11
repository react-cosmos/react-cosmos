// @flow

/**
 * Normalize exported value of ES/CJS modules
 * https://github.com/esnext/es6-module-transpiler/issues/86
 */
export function importModule(module: Object, moduleName?: string) {
  if (module.__esModule) {
    return (moduleName && module[moduleName]) || module.default;
  }

  return module;
}
