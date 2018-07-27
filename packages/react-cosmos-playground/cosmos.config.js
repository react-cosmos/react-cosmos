module.exports = {
  globalImports: ['src/utils/global.less', 'src/register-plugins'],
  exclude: [
    /_shared/,
    // NOTE: Comment this to play with the experimental plugin-based UI
    'src/next/Root/'
  ],
  port: 8090
};
