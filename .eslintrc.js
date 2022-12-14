module.exports = {
  env: {
    node: true,
  },
  extends: 'eslint-config-airbnb-base',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', {
      js: 'never',
      ts: 'never',
    }],
    'no-unused-vars': 'off', // Disabled in favour of the typescript version
    '@typescript-eslint/no-unused-vars': 'error',
    indent: 'off', // Disabled in favour of the typescript version
    '@typescript-eslint/indent': ['error', 2],
    'no-undef': 'off', // Disabled as it is mainly covered by typescript already
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
};
