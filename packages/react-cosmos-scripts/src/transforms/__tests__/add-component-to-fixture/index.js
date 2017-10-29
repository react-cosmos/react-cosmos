// @flow

import fs from 'fs';
import path from 'path';
import { addComponentToFixture } from '../../add-component-to-fixture';

function readMockFile(fileName) {
  return fs.readFileSync(
    path.join(__dirname, '__fsmocks__', `${fileName}.js`),
    'utf8'
  );
}

[
  'es-module-exist',
  'es-module-exist-name',
  'es-module-exist-path',
  'es-module-first',
  'es-module-last'
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

test('es-module-first-jsx', () => {
  const input = readMockFile(`es-module-first-jsx.input`);
  const output = readMockFile(`es-module-first-jsx.output`);

  const newCode = addComponentToFixture({
    fixtureCode: input,
    componentPath: '/path/to/component.jsx',
    componentName: 'Button'
  });

  expect(newCode).toBe(output);
});
