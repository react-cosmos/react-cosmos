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
