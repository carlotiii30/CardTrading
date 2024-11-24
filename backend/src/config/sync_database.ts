import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
import { sequelize } from "./database";
import "../models/index";

dotenv.config();

const dropDatabaseIfExists = async () => {
  const dbName = process.env.TEST_DB_DATABASE || "pokemon_trading_test";
  const dbUsername = process.env.TEST_DB_USERNAME || "pokemon_admin";
  const dbPassword = process.env.TEST_DB_PASSWORD || "Pokemon";
  const dbHost = process.env.TEST_DB_HOST || "127.0.0.1";

  const adminSequelize = new Sequelize("postgres", dbUsername, dbPassword, {
    host: dbHost,
    dialect: "postgres",
  });

  try {
    console.log(
      `Intentando eliminar la base de datos "${dbName}" si existe...`
    );
    await adminSequelize.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log(`Base de datos "${dbName}" eliminada.`);
  } catch (error: any) {
    console.error("Error al eliminar la base de datos:", error.message);
  } finally {
    await adminSequelize.close();
  }
};

const createDatabase = async () => {
  const dbName = process.env.TEST_DB_DATABASE || "pokemon_trading_test";
  const dbUsername = process.env.TEST_DB_USERNAME || "pokemon_admin";
  const dbPassword = process.env.TEST_DB_PASSWORD || "Pokemon";
  const dbHost = process.env.TEST_DB_HOST || "127.0.0.1";

  const adminSequelize = new Sequelize("postgres", dbUsername, dbPassword, {
    host: dbHost,
    dialect: "postgres",
  });

  try {
    console.log(`Creando la base de datos "${dbName}"...`);
    await adminSequelize.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base de datos "${dbName}" creada exitosamente.`);
  } catch (error: any) {
    if (error.original?.code === "42P04") {
      console.log(`La base de datos "${dbName}" ya existe.`);
    } else {
      console.error("Error al crear la base de datos:", error.message);
    }
  } finally {
    await adminSequelize.close();
  }
};

const syncDatabase = async () => {
  try {
    await dropDatabaseIfExists();
    await createDatabase();
    await sequelize.sync({ force: true });
    console.log("Modelos sincronizados con la base de datos.");
  } catch (error) {
    console.error("Error al sincronizar los modelos:", error);
  }
};

syncDatabase();
