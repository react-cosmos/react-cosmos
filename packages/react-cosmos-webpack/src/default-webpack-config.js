import HtmlWebpackPlugin from 'html-webpack-plugin';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos-webpack adds an entry & output when extending this.
export default function getDefaultWebpackConfig() {
  return {
    devtool: 'eval',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      // Using loaders instead of rules to preserve webpack 1.x compatibility
      loaders: [
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          loader: `${require.resolve('style-loader')}!${require.resolve(
            'css-loader'
          )}`,
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React Cosmos'
      })
    ]
  };
}
