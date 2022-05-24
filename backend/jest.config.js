/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  transform: {
    "^.+\\.ts$": ["@swc/jest"],
  },
  testMatch: ["**/*.spec.ts"],
};

module.exports = config;
