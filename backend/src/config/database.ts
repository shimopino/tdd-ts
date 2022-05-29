import { Dialect, Sequelize } from "sequelize";
import config from "config";

type DB_CONFIG = {
  database: string;
  username: string;
  password: string;
  dialect: Dialect;
  storage: string;
  logging: boolean;
};

const dbConfig = config.get<DB_CONFIG>("database");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging: dbConfig.logging,
  }
);

export { sequelize };
