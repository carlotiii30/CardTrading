import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/config/database";
import { User, Card, Trade } from "../src/models";
import jwt from "jsonwebtoken";

let token: string;
let testUserId: number;
let requestedCardId: number;
let offeredCardId: number;

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

  const requestedCard = await Card.create({
    name: "Pikachu",
    type: "electric",
    image: "/uploads/pikachu.png",
    description: "A cute electric Pokémon",
    userId: testUserId,
  });

  const offeredCard = await Card.create({
    name: "Charmander",
    type: "fire",
    image: "/uploads/charmander.png",
    description: "A fire Pokémon",
    userId: testUserId,
  });

  requestedCardId = requestedCard.id;
  offeredCardId = offeredCard.id;
});

afterEach(async () => {
  await Trade.destroy({ where: {} });
  await Card.destroy({ where: {} });
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await sequelize.close();
});

describe("Trades API", () => {
  describe("POST /api/trades/requestTrade", () => {
    it("should create a trade request", async () => {
      const response = await request(app)
        .post("/api/trades/requestTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({
          requestedCardId,
          offeredCardId,
        })
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        offeredCardId,
        requestedCardId,
        offeredUserId: testUserId,
        requestedUserId: testUserId,
        status: "pending",
      });
    });
  });
});
