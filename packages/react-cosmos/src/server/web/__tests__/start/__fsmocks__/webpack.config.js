export default {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/
      }
    ]
  }
};
