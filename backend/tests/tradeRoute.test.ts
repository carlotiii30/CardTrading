import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/config/database";
import { User, Card, Trade } from "../src/models";
import jwt from "jsonwebtoken";
import { before } from "node:test";

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

  token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "testSecretKey", {
    expiresIn: "1h",
  });
});

beforeEach(async () => {
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
  await Card.destroy({ where: {} });
  await Trade.destroy({ where: {} });

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

    it("should return 404 if requested card is not found", async () => {
      const response = await request(app)
        .post("/api/trades/requestTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({
          requestedCardId: 999,
          offeredCardId,
        })
        .expect(404);

      expect(response.body).toEqual({
        error: "Carta solicitada no encontrada",
      });
    });

    it("should return 404 if offered card is not found", async () => {
      const response = await request(app)
        .post("/api/trades/requestTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({
          requestedCardId,
          offeredCardId: 999,
        })
        .expect(404);

      expect(response.body).toEqual({
        error: "Carta de oferta no encontrada",
      });
    });
  });

  describe("POST /api/trades/acceptTrade", () => {
    it("should accept a trade", async () => {
      const trade = await Trade.create({
        requestedCardId,
        offeredCardId,
        requestedUserId: testUserId,
        offeredUserId: testUserId,
        status: "pending",
      });

      const response = await request(app)
        .post("/api/trades/acceptTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({ tradeId: trade.id })
        .expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Intercambio aceptado y carta actualizada"
      );
    });

    it("should return 404 if trade is not found", async () => {
      const response = await request(app)
        .post("/api/trades/acceptTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({ tradeId: 999 })
        .expect(404);

      expect(response.body).toEqual({
        error: "Intercambio no encontrado",
      });
    });
  });

  describe("GET /api/trades/getTrades", () => {
    it("should return a list of all trades", async () => {
      await Trade.bulkCreate([
        {
          requestedCardId,
          offeredCardId,
          requestedUserId: testUserId,
          offeredUserId: testUserId,
          status: "pending",
        },
        {
          requestedCardId: offeredCardId,
          offeredCardId: requestedCardId,
          requestedUserId: testUserId,
          offeredUserId: testUserId,
          status: "accepted",
        },
      ]);

      const response = await request(app)
        .get("/api/trades/getTrades")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            status: "pending",
            requestedCardId,
            offeredCardId,
          }),
        ])
      );
    });
  });

  describe("POST /api/trades/cancelTrade", () => {
    it("should cancel a trade", async () => {
      const trade = await Trade.create({
        requestedCardId,
        offeredCardId,
        requestedUserId: testUserId,
        offeredUserId: testUserId,
        status: "pending",
      });

      const response = await request(app)
        .post("/api/trades/cancelTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({ tradeId: trade.id })
        .expect(204);
    });

    it("should return 404 if trade is not found", async () => {
      const response = await request(app)
        .post("/api/trades/cancelTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({ tradeId: 999 })
        .expect(404);

      expect(response.body).toEqual({
        error: "Intercambio no encontrado",
      });
    });
  });

  describe("GET /api/trades/getTrade", () => {
    it("should return a trade by ID", async () => {
      const trade = await Trade.create({
        requestedCardId,
        offeredCardId,
        requestedUserId: testUserId,
        offeredUserId: testUserId,
        status: "pending",
      });

      const response = await request(app)
        .get("/api/trades/getTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({ tradeId: trade.id })
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toMatchObject({
        id: trade.id,
        status: "pending",
      });
    });

    it("should return 404 if trade is not found", async () => {
      const response = await request(app)
        .get("/api/trades/getTrade")
        .set("Authorization", `Bearer ${token}`)
        .query({ tradeId: 999 });

      expect(response.body).toEqual({
        error: "Intercambio no encontrado",
      });
    });
  });

  describe("GET /api/trades/getUserTrades", () => {
    it("should return trades for the authenticated user", async () => {
      await Trade.bulkCreate([
        {
          requestedCardId,
          offeredCardId,
          requestedUserId: testUserId,
          offeredUserId: testUserId,
          status: "pending",
        },
        {
          requestedCardId: offeredCardId,
          offeredCardId: requestedCardId,
          requestedUserId: testUserId,
          offeredUserId: testUserId,
          status: "accepted",
        },
      ]);

      const response = await request(app)
        .get("/api/trades/getUserTrades")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            status: "pending",
            requestedCardId,
            offeredCardId,
          }),
        ])
      );
    });
  });
});
