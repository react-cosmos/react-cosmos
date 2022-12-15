module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['react-hooks', '@typescript-eslint', 'import'],
  extends: ['plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'import/extensions': ['error', 'ignorePackages'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    'linebreak-style': 'error',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
