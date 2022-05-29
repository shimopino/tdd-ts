/**
 * 下記のページより TypeScript での node-config 利用方法を採用する
 *
 * - https://github.com/node-config/node-config/wiki
 * - https://github.com/funny-bytes/node-config-typescript-example
 */
export default {
  database: {
    database: "hoaxify",
    username: "my-db-user",
    password: "db-p4ss",
    dialect: "sqlite",
    storage: "./development.sqlite",
    logging: false,
  },
};
