import { Sequelize, Options } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";

const databaseConfig: { [key: string]: Options } = {
  development: {
    database: process.env.DB_DATABASE || "pokemon_trading",
    username: process.env.DB_USERNAME || "pokemon_admin",
    password: process.env.DB_PASSWORD || "Pokemon",
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: console.log,
  },
  test: {
    database: process.env.TEST_DB_DATABASE || "pokemon_trading_test",
    username: process.env.TEST_DB_USERNAME || "pokemon_admin",
    password: process.env.TEST_DB_PASSWORD || "Pokemon",
    host: process.env.TEST_DB_HOST || "db",
    port: Number(process.env.TEST_DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  },
};

const config = databaseConfig[env];

if (!config) {
  throw new Error(`No database configuration found for environment: ${env}`);
}

const sequelize = new Sequelize(
  config.database as string,
  config.username as string,
  config.password as string,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
  }
);

export { sequelize };
export default sequelize;
