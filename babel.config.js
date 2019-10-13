const envOptions = {
  corejs: 3,
  modules: 'commonjs',
  targets: { ie: '11' },
  useBuiltIns: 'usage'
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
