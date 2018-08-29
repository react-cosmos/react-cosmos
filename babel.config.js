module.exports = {
  presets: ['@babel/env', '@babel/react', '@babel/flow'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    ['@babel/transform-runtime', { corejs: 2 }]
  ]
};
