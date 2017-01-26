const path = require('path');
const mkdirp = require('mkdirp');
const touch = require('touch');

const useCases = {
  'relative-fixtures': (`
    components/Foo.js
    components/nested/Bar.jsx
    components/nested/Baz.jsx
    components/__fixtures__/Foo/blank.js
    components/__fixtures__/nested/Bar/one.js
    components/__fixtures__/nested/Bar/two.js
    components/__fixtures__/nested/Bar/three.js
  `),
  'relative-fixtures-component-dir': (`
    components/Foo/Foo.js
    components/Foo/__fixtures__/blank.js
    components/nested/Bar/Bar.jsx
    components/nested/Bar/__fixtures__/one.js
    components/nested/Bar/__fixtures__/two.js
  `),
  'external-fixtures': (`
    components/Foo.js
    components/nested/Bar.jsx
    fixtures/Foo/blank.js
    fixtures/nested/Bar/one.js
    fixtures/nested/Bar/two.js
  `),
  'separate-packages': (`
    packages/Foo/src/index.js
    packages/Foo/src/__fixtures__/blank.js
    packages/nested/Bar/src/index.jsx
    packages/nested/Bar/src/__fixtures__/one.js
    packages/nested/Bar/src/__fixtures__/two.js
  `),
  'separate-packages-external-fixtures': (`
    packages/Foo/src/index.js
    packages/nested/Bar/src/index.jsx
    fixtures/Foo/blank.js
    fixtures/nested/Bar/one.js
    fixtures/nested/Bar/two.js
  `),
};

Object.keys(useCases).forEach((useCase) => {
  useCases[useCase].split('\n')
    .map(p => p.trim())
    .filter(p => !!p.length)
    .forEach((p) => {
      const filePath = path.join(__dirname, '../src/__tests__/use-cases/', useCase, p);
      const dir = path.dirname(filePath);
      mkdirp(dir, (err) => {
        if (err) {
          console.error(err);
        } else {
          touch(filePath);
        }
      });
    });
});
