// useBuiltIns: 'usage' would remove the need to import the core-js and
// regenerator-runtime polyfills in every entry point, but it crashes on IE11
// https://stackoverflow.com/q/40897966/128816
const envOptions = {
  useBuiltIns: 'entry',
  corejs: 3,
  targets: { ie: '11' }
};

module.exports = {
  presets: [
    ['@babel/preset-env', envOptions],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ]
};
