import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true,
  staticImage: true,
  flexsearch: {
    codeblocks: false,
  },
});

export default withNextra({
  output: 'export',
  images: { unoptimized: true },
  webpack(config) {
    const allowedSvgRegex = /\/components\/svg\/.+\.svg$/;

    const fileLoaderRule = config.module.rules.find(rule => {
      return rule.test instanceof RegExp && rule.test.test('.svg');
    });
    fileLoaderRule.exclude = allowedSvgRegex;

    // These rule allows importing SVGs as React components,
    // but breaks the ability to use SVGs as background images in CSS,
    // which Next.js handles by default.
    config.module.rules.push({
      test: allowedSvgRegex,
      use: ['@svgr/webpack'],
    });
    return config;
  },
});
