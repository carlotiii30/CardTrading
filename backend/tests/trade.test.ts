import { Op } from "sequelize";
import { Request, Response, NextFunction } from "express";
import {
  requestTrade,
  acceptTrade,
  cancelTrade,
  getTrades,
  getTrade,
  getUserTrades,
} from "../src/controllers/tradeController";
import { Card, Trade, User } from "../src/models/index";
import { mockRequest, mockResponse } from "jest-mock-req-res";

jest.mock("../src/models/index");

describe("Trade Controller", () => {
  describe("acceptTrade", () => {
    it("should accept a trade and update cards", async () => {
      const req = mockRequest({
        query: { tradeId: "1" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (Trade.findByPk as jest.Mock).mockResolvedValue({
        id: 1,
        status: "pending",
        save: jest.fn().mockResolvedValue(true),
        offeredCardId: "1",
        requestedCardId: "2",
        offeredUserId: 3,
        requestedUserId: 4,
      });

      await acceptTrade(req, res, next);

      expect(Trade.findByPk).toHaveBeenCalledWith("1", expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({
        message: "Intercambio aceptado y carta actualizada",
      });
    });

    it("should return 404 if trade is not found", async () => {
      const req = mockRequest({
        query: { tradeId: "1" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (Trade.findByPk as jest.Mock).mockResolvedValue(null);

      await acceptTrade(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Intercambio no encontrado",
      });
    });
  });

  describe("cancelTrade", () => {
    it("should cancel a trade", async () => {
      const req = mockRequest({
        query: { tradeId: "1" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (Trade.findByPk as jest.Mock).mockResolvedValue({
        id: 1,
        status: "pending",
        destroy: jest.fn().mockResolvedValue(true),
      });

      await cancelTrade(req, res, next);

      expect(Trade.findByPk).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 404 if trade is not found", async () => {
      const req = mockRequest({
        query: { tradeId: "1" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (Trade.findByPk as jest.Mock).mockResolvedValue(null);

      await cancelTrade(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Intercambio no encontrado",
      });
    });
  });

  describe("getTrades", () => {
    it("should return all trades", async () => {
      const req = mockRequest() as unknown as Request;
      const res = mockResponse() as unknown as Response;

      (Trade.findAll as jest.Mock).mockResolvedValue([
        { id: 1, status: "pending" },
        { id: 2, status: "accepted" },
      ]);

      await getTrades(req, res);

      expect(Trade.findAll).toHaveBeenCalledWith(expect.any(Object));
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, status: "pending" },
        { id: 2, status: "accepted" },
      ]);
    });
  });

  describe("getTrade", () => {
    it("should return a trade by ID", async () => {
      const req = mockRequest({
        query: { tradeId: "1" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;

      (Trade.findByPk as jest.Mock).mockResolvedValue({
        id: 1,
        status: "pending",
      });

      await getTrade(req, res);

      expect(Trade.findByPk).toHaveBeenCalledWith("1", expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({ id: 1, status: "pending" });
    });

    it("should return 404 if trade is not found", async () => {
      const req = mockRequest({
        query: { tradeId: "999" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;

      (Trade.findByPk as jest.Mock).mockResolvedValue(null);

      await getTrade(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Intercambio no encontrado",
      });
    });
  });

  describe("getUserTrades", () => {
    it("should return trades for the authenticated user", async () => {
      const req = mockRequest({
        user: { id: 3 },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;

      (Trade.findAll as jest.Mock).mockResolvedValue([
        { id: 1, offeredUserId: 3, status: "pending" },
        { id: 2, requestedUserId: 3, status: "accepted" },
      ]);

      await getUserTrades(req, res);

      expect(Trade.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            [Op.or]: [{ offeredUserId: 3 }, { requestedUserId: 3 }],
          }),
        })
      );
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, offeredUserId: 3, status: "pending" },
        { id: 2, requestedUserId: 3, status: "accepted" },
      ]);
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = mockRequest() as unknown as Request;
      const res = mockResponse() as unknown as Response;

      await getUserTrades(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuario no autenticado",
      });
    });
  });
});
