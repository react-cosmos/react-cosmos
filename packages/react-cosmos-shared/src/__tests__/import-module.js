import { importModule } from '../import-module';

const commonJsModule = {
  foo: {
    bar: () => {}
  }
};

const es6ModuleWithDefaultExport = {
  __esModule: true,
  default: {
    bar: () => {}
  }
};

const es6Module = {
  __esModule: true,
  foo: {
    bar: () => {}
  }
};

const es6ModuleWithMultiExports = Object.assign({}, es6Module, {
  default: {}
});

test('returns es6 module containing default export', () => {
  expect(importModule(es6ModuleWithDefaultExport, 'foo')).toBe(
    es6ModuleWithDefaultExport.default
  );
});

test('returns es6 module containing named export', () => {
  expect(importModule(es6Module, 'foo')).toBe(es6Module.foo);
});

test('returns es6 module containing default and named exports', () => {
  expect(importModule(es6ModuleWithMultiExports, 'foo')).toBe(
    es6ModuleWithMultiExports.foo
  );
});

test('returns commonjs module', () => {
  expect(importModule(commonJsModule, 'foo')).toBe(commonJsModule);
});
