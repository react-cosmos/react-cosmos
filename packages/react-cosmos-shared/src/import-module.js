/**
 * Normalize exported value of ES6/CommonJS modules
 */
export function importModule(module, moduleName) {
  // This is an implementation detail of Babel:
  // https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.skvldbg39
  // https://github.com/esnext/es6-module-transpiler/issues/86

  if (module.__esModule) {
    return (moduleName && module[moduleName]) || module.default;
  }

  return module;
}
