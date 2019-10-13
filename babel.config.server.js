const envOptions = {
  targets: { node: 8 }
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
