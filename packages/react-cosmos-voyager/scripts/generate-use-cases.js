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
    components/__fixtures__/nested/Bar/two.json
    components/__fixtures__/nested/Baz/blank.js
  `),
  'relative-fixtures-component-dir': (`
    components/Foo/Foo.js
    components/Foo/__fixtures__/blank.js
    components/nested/Bar/Bar.jsx
    components/nested/Bar/__fixtures__/one.js
    components/nested/Bar/__fixtures__/two.json
    components/nested/Baz/Baz.jsx
    components/nested/Baz/__fixtures__/blank.js
  `),
  'external-fixtures': (`
    components/Foo.js
    components/nested/Bar.jsx
    components/nested/Baz.jsx
    fixtures/Foo/blank.js
    fixtures/nested/Bar/one.js
    fixtures/nested/Bar/two.json
    fixtures/nested/Baz/blank.js
  `),
  'separate-packages': (`
    pkgs/Foo/src/index.js
    pkgs/Foo/src/__fixtures__/blank.js
    pkgs/nested/Bar/src/index.jsx
    pkgs/nested/Bar/src/__fixtures__/one.js
    pkgs/nested/Bar/src/__fixtures__/two.json
    pkgs/nested/Baz/src/index.js
    pkgs/nested/Baz/src/__fixtures__/blank.js
  `),
  'separate-packages-external-fixtures': (`
    pkgs/Foo/src/index.js
    pkgs/nested/Bar/src/index.jsx
    pkgs/nested/Baz/src/index.jsx
    fixtures/Foo/blank.js
    fixtures/nested/Bar/one.js
    fixtures/nested/Bar/two.json
    fixtures/nested/Baz/blank.js
  `),
};

Object.keys(useCases).forEach((useCase) => {
  useCases[useCase].split('\n')
    .map(p => p.trim())
    .filter(p => !!p.length)
    .forEach((p) => {
      const filePath = path.join(__dirname, '../src/use-cases/', useCase, p);
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
