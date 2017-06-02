const path = require('path');
const mkdirp = require('mkdirp');
const touch = require('touch');
const rimraf = require('rimraf');

const useCases = {
  'relative-fixtures': (`
    components/Foo.js
    components/nested/Bar.jsx
    components/nested/Baz.jsx
    components/__fixtures__/Foo/blank.js
    components/__fixtures__/nested/Bar/one.js
    components/__fixtures__/nested/Bar/two.json
    components/__fixtures__/nested/Bar/three.jsx
    components/__fixtures__/nested/Baz/blank.js
  `),
  'relative-fixtures-component-dir': (`
    components/Foo/Foo.js
    components/Foo/__fixtures__/blank.js
    components/nested/Bar/Bar.jsx
    components/nested/Bar/__fixtures__/one.js
    components/nested/Bar/__fixtures__/two.json
    components/nested/Bar/__fixtures__/three.jsx
    components/nested/Baz/Baz.jsx
    components/nested/Baz/__fixtures__/blank.js
  `),
  'relative-fixtures-component-dir-index': (`
    components/Foo/index.js
    components/Foo/__fixtures__/blank.js
    components/nested/Bar/index.jsx
    components/nested/Bar/__fixtures__/one.js
    components/nested/Bar/__fixtures__/two.json
    components/nested/Bar/__fixtures__/three.jsx
  `),
  'external-fixtures': (`
    components/Foo.js
    components/nested/Bar.jsx
    components/nested/Baz.jsx
    fixtures/Foo/blank.js
    fixtures/nested/Bar/one.js
    fixtures/nested/Bar/two.json
    fixtures/nested/Bar/three.jsx
    fixtures/nested/Baz/blank.js
  `),
  'separate-packages': (`
    pkgs/Foo/src/index.js
    pkgs/Foo/src/__fixtures__/blank.js
    pkgs/nested/Bar/src/index.jsx
    pkgs/nested/Bar/src/__fixtures__/one.js
    pkgs/nested/Bar/src/__fixtures__/two.json
    pkgs/nested/Bar/src/__fixtures__/three.jsx
    pkgs/nested/Baz/src/index.js
    pkgs/nested/Baz/src/__fixtures__/blank.js
  `),
  'separate-packages-external-fixtures': (`
    pkgs/Foo/src/index.js
    pkgs/Foo/fixtures/blank.js
    pkgs/nested/Bar/src/index.jsx
    pkgs/nested/Bar/fixtures/one.js
    pkgs/nested/Bar/fixtures/two.json
    pkgs/nested/Bar/fixtures/three.jsx
    pkgs/nested/Baz/src/index.jsx
    pkgs/nested/Baz/fixtures/blank.js
  `),
  'fixtures-dir-setting': (`
    components/Foo.js
    components/nested/Bar.jsx
    components/nested/Baz.jsx
    components/__fixtures__/Foo/blank.js
    components/__fixtures__/nested/Bar/one.js
    components/__fixtures__/nested/Bar/two.json
    components/__fixtures__/nested/Bar/three.jsx
    components/__fixtures__/nested/Baz/blank.js
  `),
};

const useCasePath = path.join(__dirname, '../src/use-cases');

rimraf.sync(useCasePath);

Object.keys(useCases).forEach(useCase => {
  useCases[useCase].split('\n')
    .map(p => p.trim())
    .filter(p => Boolean(p.length))
    .forEach(p => {
      const filePath = path.join(useCasePath, useCase, p);
      const dir = path.dirname(filePath);
      mkdirp(dir, err => {
        if (err) {
          console.error(err);
        } else {
          touch(filePath);
        }
      });
    });
});
