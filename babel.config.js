module.exports = {
  presets: ['@babel/env', '@babel/react', '@babel/flow'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/transform-runtime'
  ],
  // TODO: Understand why this is needed
  // https://github.com/babel/babel-loader/pull/660#issuecomment-416760833
  sourceType: 'unambiguous'
};
