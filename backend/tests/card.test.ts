import { Request, Response, NextFunction } from "express";
import { createCard, getAllCards } from "../src/controllers/cardController";
import { Card } from "../src/models";
import { mockRequest, mockResponse } from "jest-mock-req-res";

jest.mock("../src/models");

describe("Card Controller", () => {
  describe("createCard", () => {
    it("should create a new card", async () => {
      const req = mockRequest({
        user: { id: 1 },
        body: {
          name: "Pikachu",
          type: ["electric"],
          description: "A cute electric Pokémon",
        },
        file: { filename: "pikachu.png" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as unknown as NextFunction;

      (Card.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Pikachu",
        type: ["electric"],
        image: "/uploads/pikachu.png",
        description: "A cute electric Pokémon",
        userId: 1,
      });

      await createCard(req, res, next);

      expect(Card.create).toHaveBeenCalledWith({
        name: "Pikachu",
        type: ["electric"],
        image: "/uploads/pikachu.png",
        description: "A cute electric Pokémon",
        userId: 1,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: "Pikachu",
        type: ["electric"],
        image: "/uploads/pikachu.png",
        description: "A cute electric Pokémon",
        userId: 1,
      });
    });

    it("should handle errors", async () => {
      const req = mockRequest({
        user: { id: 1 },
        body: {
          name: "Pikachu",
          type: ["electric"],
          description: "A cute electric Pokémon",
        },
        file: { filename: "pikachu.png" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as unknown as NextFunction;

      const error = new Error("Database error");
      (Card.create as jest.Mock).mockRejectedValue(error);

      await createCard(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllCards", () => {
    it("should return all cards", async () => {
      const req = mockRequest() as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as unknown as NextFunction;

      const cards = [
        {
          id: 1,
          name: "Pikachu",
          type: ["electric"],
          image: "/uploads/pikachu.png",
          description: "A cute electric Pokémon",
          userId: 1,
        },
      ];
      (Card.findAll as jest.Mock).mockResolvedValue(cards);

      await getAllCards(req, res, next);

      expect(Card.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(cards);
    });

    it("should handle errors", async () => {
      const req = mockRequest() as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as unknown as NextFunction;

      const error = new Error("Database error");
      (Card.findAll as jest.Mock).mockRejectedValue(error);

      await getAllCards(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
