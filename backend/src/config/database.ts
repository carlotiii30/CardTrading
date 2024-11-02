import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";

interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: "postgres";
}

const databaseConfig: { [key: string]: DatabaseConfig } = {
  development: {
    database: process.env.DB_DATABASE || "pokemon_trading",
    username: process.env.DB_USERNAME || "pokemon_admin",
    password: process.env.DB_PASSWORD || "Pokemon",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
  },
  test: {
    database: process.env.TEST_DB_DATABASE || "pokemon_trading_test",
    username: process.env.TEST_DB_USERNAME || "pokemon_admin",
    password: process.env.TEST_DB_PASSWORD || "pregunta_al_admin",
    host: process.env.TEST_DB_HOST || "127.0.0.1",
    port: Number(process.env.TEST_DB_PORT) || 5432,
    dialect: "postgres",
  },
};

const config = databaseConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
  }
);

export { sequelize };
export default sequelize;
