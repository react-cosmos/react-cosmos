module.exports = {
  globalImports: [
    'src/utils/global.less'
    // NOTE: Uncomment this to play with the experimental plugin-based UI
    // 'src/next/register-plugins'
  ],
  exclude: [
    /_shared/,
    // NOTE: Comment this to play with the experimental plugin-based UI
    'src/next/Root/'
  ],
  port: 8090
};
