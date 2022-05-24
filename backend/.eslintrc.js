/** @type {import('eslint/lib/shared/types').ConfigData} */
const config = {
  /**
   * 下記のURLを参考に作成している
   * https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/README.md
   */
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
};

module.exports = config;
