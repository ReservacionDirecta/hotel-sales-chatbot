module.exports = {
  ignores: ['**/dist/**', '**/node_modules/**'],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  rules: {
    '@nestjs/core/no-badge': 'off',
  },
};
