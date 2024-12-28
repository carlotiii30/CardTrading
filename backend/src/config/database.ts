import { Sequelize, Options } from "sequelize";

const env = process.env.NODE_ENV || "development";

const databaseConfig: { [key: string]: Options } = {
  development: {
    database: "pokemon_trading",
    username: "pokemon_admin",
    password: "Pokemon",
    host: "db",
    port: 5432,
    dialect: "postgres",
    logging: console.log,
  },
  test: {
    database: "pokemon_trading_test",
    username: "pokemon_admin",
    password: "Pokemon",
    host: "db",
    port: 5432,
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
