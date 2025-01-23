import fs from "fs";
import express from "express";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/userRoutes";
import cardRoutes from "./routes/cardRoutes";
import tradeRoutes from "./routes/tradeRoutes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./services/swagger";
import { httpLogger } from "./config/logger";

const app = express();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(path.resolve("uploads")));

app.use(cors());
app.use(express.json());

app.use(httpLogger);

app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/trades", tradeRoutes);

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta raíz
app.get("/", (req, res) => {
  res.redirect("/docs");
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
