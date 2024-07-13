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
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['cosmos.imports.ts'],
      rules: {
        'import/extensions': 'off',
      },
    },
    {
      files: ['*.fixture.{ts,tsx}', '**/__fixtures__/**'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
      },
    },
  ],
};
