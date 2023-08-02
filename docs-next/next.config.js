import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true,
  staticImage: true,
});

export default withNextra({
  webpack(config) {
    const allowedSvgRegex = /components\/icons\/.+\.svg$/;

    const fileLoaderRule = config.module.rules.find(rule =>
      rule.test?.test('.svg')
    );
    fileLoaderRule.exclude = allowedSvgRegex;

    config.module.rules.push({
      test: allowedSvgRegex,
      use: ['@svgr/webpack'],
    });
    return config;
  },
});
