import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE || "pokemon_trading",
  process.env.DB_USERNAME || "pokemon_admin",
  process.env.DB_PASSWORD || "pregunta_al_admin",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
  }
);

export { sequelize };
