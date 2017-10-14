// @flow

import fs from 'fs';
import path from 'path';
import { addComponentToFixture } from '../addComponentToFixture';

function readMockFile(fileName) {
  return fs.readFileSync(
    path.join(__dirname, '__fsMocks__', `${fileName}.js`),
    'utf8'
  );
}

[
  'esModuleExist',
  'esModuleExistName',
  'esModuleExistPath',
  'esModuleFirst',
  'esModuleLast'
].forEach(testName => {
  test(testName, () => {
    const input = readMockFile(`${testName}.input`);
    const output = readMockFile(`${testName}.output`);

    const newCode = addComponentToFixture({
      fixtureCode: input,
      componentPath: '/path/to/component.js',
      componentName: 'Button'
    });

    expect(newCode).toBe(output);
  });
});

test('esModuleFirstJsx', () => {
  const input = readMockFile(`esModuleFirstJsx.input`);
  const output = readMockFile(`esModuleFirstJsx.output`);

  const newCode = addComponentToFixture({
    fixtureCode: input,
    componentPath: '/path/to/component.jsx',
    componentName: 'Button'
  });

  expect(newCode).toBe(output);
});
