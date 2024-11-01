import { sequelize } from "./database";
import "../models/index";

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Modelos sincronizados con la base de datos.");
  })
  .catch((err) => {
    console.error("Error al sincronizar los modelos:", err);
  });
