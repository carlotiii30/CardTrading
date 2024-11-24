import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
import { sequelize } from "./database";
import "../models/index";

dotenv.config();

const createDatabaseIfNotExists = async () => {
  const dbName = process.env.DB_DATABASE || "pokemon_trading_test";
  const dbUsername = process.env.DB_USERNAME || "pokemon_admin";
  const dbPassword = process.env.DB_PASSWORD || "Pokemon";
  const dbHost = process.env.DB_HOST || "127.0.0.1";

  const adminSequelize = new Sequelize("postgres", dbUsername, dbPassword, {
    host: dbHost,
    dialect: "postgres",
  });

  try {
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
    await createDatabaseIfNotExists();
    await sequelize.sync({ force: true });
    console.log("Modelos sincronizados con la base de datos.");
  } catch (error) {
    console.error("Error al sincronizar los modelos:", error);
  }
};

syncDatabase();
