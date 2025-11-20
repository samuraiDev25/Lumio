module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-clean-order',
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true, // Prettier проверяет формат
  },
  ignoreFiles: ['**/node_modules/**', '**/.next/**'],
};
