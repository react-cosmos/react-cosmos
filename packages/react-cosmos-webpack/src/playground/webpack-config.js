// import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default function getWebpackConfig({ fixtures }) {
  return {
    entry: `${require.resolve('../entry-loader')}?${JSON.stringify({
      // We escape the contents because component or fixture paths might contain
      // an ! (exclamation point), which throws webpack off thinking everything
      // after is the entry file path.
      fixtures: escape(fixtures),
    })}!${require.resolve('./entry')}`,
    output: {
      // Webpack doesn't write to this path when saving build in memory, but
      // webpack-dev-middleware seems to crash
      // without it
      path: '/',
      // Also not a real file. HtmlWebpackPlugin uses this path for the script
      // tag it injects.
      filename: 'bundle.js',
      publicPath: '/',
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      }],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'React Cosmos',
      }),
    ],
  };
}
