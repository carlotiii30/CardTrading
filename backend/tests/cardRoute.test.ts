import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/config/database";
import { Card, User } from "../src/models";
import path from "path";
import jwt from "jsonwebtoken";

let token: string;
let testUserId: number;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    username: "testuser",
    password: "testpassword",
    role: "user",
  });

  testUserId = user.id;

  token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "MEGASUPERSECRET",
    {
      expiresIn: "1h",
    }
  );
});

beforeEach(async () => {
  await Card.destroy({ where: {} });
});

afterEach(async () => {
  const cards = await Card.findAll();
  console.log(
    "Cartas en la base de datos:",
    cards.map((card) => card.toJSON())
  );
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await sequelize.close();
});

describe("Cards API", () => {
    it("should return 401 if user is not authenticated", async () => {
      const response = await request(app)
        .post("/api/cards/createCard")
        .field("name", "Pikachu")
        .field("type", "electric")
        .field("description", "A cute electric Pokémon");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Acceso denegado" });
    });
  });

  describe("GET /getAllCards", () => {
    it("should return all cards", async () => {
      const cards = [
        {
          name: "Pikachu",
          type: "electric",
          image: "/uploads/pikachu.png",
          description: "A cute electric Pokémon",
          userId: testUserId,
        },
        {
          name: "Charmander",
          type: "fire",
          image: "/uploads/charmander.png",
          description: "A fire Pokémon",
          userId: testUserId,
        },
      ];

      await Card.bulkCreate(cards);

      const response = await request(app)
        .get("/api/cards/getAllCards")
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Pikachu",
            type: "electric",
            description: "A cute electric Pokémon",
          }),
          expect.objectContaining({
            name: "Charmander",
            type: "fire",
            description: "A fire Pokémon",
          }),
        ])
      );
    });
  });

  describe("GET /getCard", () => {
    it("should return a card by ID", async () => {
      const card = await Card.create({
        name: "Pikachu",
        type: "electric",
        image: "/uploads/pikachu.png",
        description: "A cute electric Pokémon",
        userId: testUserId,
      });

      const response = await request(app)
        .get("/api/cards/getCard")
        .set("Authorization", `Bearer ${token}`)
        .query({ id: card.id })
        .expect(200);

      expect(response.body).toMatchObject({
        name: "Pikachu",
        type: "electric",
        description: "A cute electric Pokémon",
      });
    });

    it("should return 404 if card not found", async () => {
      const response = await request(app)
        .get("/api/cards/getCard")
        .set("Authorization", `Bearer ${token}`)
        .query({ id: 999 })
        .expect(404);

      expect(response.body).toEqual({ error: "Carta no encontrada" });
    });

    it("should return 401 if user is not authenticated", async () => {
      const response = await request(app)
        .get("/api/cards/getCard")
        .query({ id: 1 })
        .expect(401);

      expect(response.body).toEqual({ error: "Acceso denegado" });
    });
  });
});

describe("DELETE /deleteCard", () => {
  it("should delete a card by ID", async () => {
    const card = await Card.create({
      name: "Pikachu",
      type: "electric",
      image: "/uploads/pikachu.png",
      description: "A cute electric Pokémon",
      userId: testUserId,
    });

    const deletedCard = await Card.findByPk(card.id);
    expect(deletedCard).not.toBeNull();

    await request(app)
      .delete(`/api/cards/deleteCard`)
      .set("Authorization", `Bearer ${token}`)
      .query({ id: card.id })
      .expect(204);

    const checkDeletedCard = await Card.findByPk(card.id);
    expect(checkDeletedCard).toBeNull();
  });

  it("should return 404 if card not found", async () => {
    const response = await request(app)
      .delete("/api/cards/deleteCard")
      .set("Authorization", `Bearer ${token}`)
      .query({ id: 999 })
      .expect(404);

    expect(response.body).toEqual({ error: "Carta no encontrada" });
  });

  it("should return 401 if user is not authenticated", async () => {
    const response = await request(app)
      .delete("/api/cards/deleteCard")
      .query({ id: 1 })
      .expect(401);

    expect(response.body).toEqual({ error: "Acceso denegado" });
  });
});
