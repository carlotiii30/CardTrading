import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../src/models/index";
import {
  registerUser,
  loginUser,
  getProfile,
  getUsers,
  getUserById,
} from "../src/controllers/userController";
import { mockRequest, mockResponse } from "jest-mock-req-res";

jest.mock("../src/models/index");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  describe("registerUser", () => {
    it("should register a new user and return a token", async () => {
      const req = mockRequest({
        query: { username: "testUser", password: "password123", role: "user" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (bcrypt.hash as jest.Mock).mockResolvedValue("encryptedPassword");
      (User.create as jest.Mock).mockResolvedValue({
        id: 1,
        username: "testUser",
        role: "user",
      });
      (jwt.sign as jest.Mock).mockReturnValue("testToken");

      await registerUser(req, res, next);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(User.create).toHaveBeenCalledWith({
        username: "testUser",
        password: "encryptedPassword",
        role: "user",
      });
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, expect.any(String), {
        expiresIn: "1h",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: { id: 1, username: "testUser", role: "user" },
        token: "testToken",
      });
    });

    it("should handle validation errors", async () => {
      const req = mockRequest({
        query: { username: "", password: "password123", role: "user" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });

    it("should handle unique constraint errors", async () => {
      const req = mockRequest({
        query: {
          username: "existingUser",
          password: "password123",
          role: "user",
        },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      const error = new Error();
      (error as any).name = "SequelizeUniqueConstraintError";
      (User.create as jest.Mock).mockRejectedValue(error);

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "El nombre de usuario ya está en uso",
      });
    });
  });

  describe("loginUser", () => {
    it("should log in a user and return a token", async () => {
      const req = mockRequest({
        query: { username: "testUser", password: "password123" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        username: "testUser",
        password: "encryptedPassword",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("testToken");

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "testUser" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "encryptedPassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, expect.any(String), {
        expiresIn: "1h",
      });
      expect(res.json).toHaveBeenCalledWith({
        user: { id: 1, username: "testUser", password: "encryptedPassword" },
        token: "testToken",
      });
    });

    it("should handle missing credentials", async () => {
      const req = mockRequest({
        query: { username: "testUser" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Faltan datos" });
    });

    it("should handle user not found", async () => {
      const req = mockRequest({
        query: { username: "nonexistentUser", password: "password123" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Usuario no encontrado" });
    });

    it("should handle incorrect password", async () => {
      const req = mockRequest({
        query: { username: "testUser", password: "wrongPassword" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        username: "testUser",
        password: "encryptedPassword",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Contraseña incorrecta" });
    });
  });

  describe("getProfile", () => {
    it("should return the user profile", () => {
      const req = mockRequest({
        user: { id: 1, username: "testUser", role: "user" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;

      getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({
        user: { id: 1, username: "testUser", role: "user" },
      });
    });
  });

  describe("getUsers", () => {
    it("should return all users", async () => {
      const req = mockRequest() as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (User.findAll as jest.Mock).mockResolvedValue([
        { id: 1, username: "user1", role: "user" },
        { id: 2, username: "user2", role: "admin" },
      ]);

      await getUsers(req, res, next);

      expect(User.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        users: [
          { id: 1, username: "user1", role: "user" },
          { id: 2, username: "user2", role: "admin" },
        ],
      });
    });
  });

  describe("getUserById", () => {
    it("should return user by ID", async () => {
      const req = mockRequest({
        query: { id: "1" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (User.findByPk as jest.Mock).mockResolvedValue({
        id: 1,
        username: "user1",
        role: "user",
      });

      await getUserById(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith({
        user: { id: 1, username: "user1", role: "user" },
      });
    });

    it("should return 404 if user is not found", async () => {
      const req = mockRequest({
        query: { id: "999" },
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await getUserById(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith("999");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Usuario no encontrado" });
    });

    it("should return 400 if ID is invalid", async () => {
      const req = mockRequest({
        query: { id: 123 }, // ID numérico en lugar de cadena
      }) as unknown as Request;
      const res = mockResponse() as unknown as Response;
      const next = jest.fn() as NextFunction;

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "ID inválido" });
    });
  });
});
