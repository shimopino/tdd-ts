/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  transform: {
    "^.+\\.ts$": ["@swc/jest"],
  },
};

module.exports = config;
