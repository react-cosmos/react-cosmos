// NOTE: These packages need decoupling from browser APIs to work in react-native
const browserProxies = [
  'react-cosmos-apollo-proxy',
  'react-cosmos-xhr-proxy',
  'react-cosmos-fetch-proxy',
  'react-cosmos-localstorage-proxy'
];

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:flowtype/recommended'
  ],
  env: {
    'shared-node-browser': true,
    commonjs: true,
    es6: true
  },
  settings: {
    react: {
      version: '16.4'
    }
  },
  rules: {
    'spaced-comment': 2,
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: 'return' }
    ],
    // Cosmos uses console.log/warn/error to inform users ¯\_(ツ)_/¯
    // Not ideal, because temporary console calls can be committed by mistake.
    'no-console': 0,
    // I don't believe in default exports anymore
    'import/default': 0,
    // There are a lot lot of test components in the repo...
    'react/prop-types': 0,
    'react/display-name': 0,
    'react/no-string-refs': 0,
    'react/no-unescaped-entities': 0,
    // TODO: Replace deprecated methods
    'react/no-deprecated': 1,
    // flowtype/generic-spacing conflicts with Prettier
    'flowtype/generic-spacing': 0
  },
  overrides: [
    nodeEnv([
      '.jest/config{,.ts}.js',
      'scripts/**/*.js',
      'packages/{react-cosmos-config,react-cosmos-scripts,react-cosmos-telescope}/src/**/*.js',
      'packages/{react-cosmos-shared,react-cosmos,react-cosmos-voyager2}/src/server/**/*.js',
      'packages/react-cosmos/bin/**/*.js',
      'packages/react-cosmos-voyager/scripts/generate-use-cases.js',
      'packages/react-cosmos-playground/webpack.config.js'
    ]),
    browserEnv([
      `packages/{${[
        'react-cosmos-playground',
        'react-querystring-router',
        ...browserProxies
      ].join(',')}}/src/**/*.js`,
      'packages/{react-cosmos,react-cosmos-voyager2}/src/client/**/*.js',
      'packages/react-cosmos-loader/src/dom/**/*.js'
    ]),
    jestEnv([
      '.jest/setup-framework.js',
      '**/__mocks__/**/*.js',
      '**/__tests__/**/*.js',
      '**/?(*.)test.js',
      '**/testHelpers/**/*.js',
      'packages/react-cosmos-telescope/src/**/*.js'
    ]),
    cypressEnv(['cypress/**/*.js']),
    userBuildEnv(['packages/react-cosmos/src/client/**/*.js'])
  ]
};

function nodeEnv(files) {
  return {
    files,
    env: {
      node: true
    }
  };
}

function browserEnv(files) {
  return {
    files,
    env: {
      browser: true
    }
  };
}

function jestEnv(files) {
  return {
    files,
    env: {
      jest: true,
      node: true
    }
  };
}

function cypressEnv(files) {
  return {
    files,
    env: {
      mocha: true
    },
    globals: {
      cy: true
    }
  };
}

function userBuildEnv(files) {
  return {
    files,
    globals: {
      __DEV__: true,
      // Enable use of process.env.NODE_ENV
      process: true
    }
  };
}
