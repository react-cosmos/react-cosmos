const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');
const nodeModules = path.join(__dirname, '../../node_modules');

const env = process.env.NODE_ENV || 'development';
const plugins = [];

if (env === 'development') {
  // Used by Cosmos config (when loading Playground inside Playground)
  plugins.push(
    new HtmlWebpackPlugin({
      title: 'React Cosmos'
    })
  );
}

module.exports = {
  mode: env,
  // Besides other advantages, cheap-module-source-map is compatible with
  // React.componentDidCatch https://github.com/facebook/react/issues/10441
  devtool: 'cheap-module-source-map',
  entry: ['whatwg-fetch', src],
  output: {
    libraryTarget: 'umd',
    library: 'mountPlayground',
    path: dist,
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          src,
          // Allow building playground from uncompiled monorepo deps
          /(react-cosmos-.+|react-querystring-router)(\/|\\)src/,
          /react-cosmos-flow/
        ],
        use: 'babel-loader'
      },
      {
        test: /\.(css|less)$/,
        include: src,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        include: nodeModules,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff)$/,
        include: src,
        use: 'url-loader'
      }
    ]
  },
  plugins
};
