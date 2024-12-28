import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/config/database";
import { User } from "../src/models";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

let token: string;
let testUserId: number;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user = await User.create({
    username: "testuser",
    password: await bcrypt.hash("testpassword", 10),
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

afterEach(async () => {
  const users = await User.findAll();
  console.log(
    "Usuarios en la base de datos:",
    users.map((user) => user.toJSON())
  );
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await sequelize.close();
});

describe("Users API", () => {
  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .query({
          username: "newuser",
          password: "newpassword",
          role: "user",
        })
        .expect(201);

      expect(response.body).toMatchObject({
        user: {
          username: "newuser",
          role: "user",
        },
      });
    });

    it("should return 400 if username is missing", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .query({
          password: "newpassword",
          role: "user",
        })
        .expect(400);

      expect(response.body).toEqual({
        error: "username is required",
      });
    });
  });

  describe("POST /api/users/login", () => {
    it("should login a user and return a token", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .query({
          username: "testuser",
          password: "testpassword",
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
    });

    it("should return 404 if user is not found", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .query({
          username: "nonexistentuser",
          password: "testpassword",
        })
        .expect(404);

      expect(response.body).toEqual({
        error: "Usuario no encontrado",
      });
    });

    it("should return 401 for incorrect password", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .query({
          username: "testuser",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toEqual({
        error: "Contraseña incorrecta",
      });
    });
  });

  describe("GET /api/users/getUsers", () => {
    it("should return a list of all users", async () => {
      const response = await request(app)
        .get("/api/users/getUsers")
        .expect(200);

      expect(response.body).toHaveProperty("users");
      expect(response.body.users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: "testuser",
          }),
        ])
      );
    });
  });

  describe("GET /api/users/getUserById", () => {
    it("should return a user by ID", async () => {
      const user = await User.create({
        username: "useridtest",
        password: "password",
        role: "user",
      });

      const response = await request(app)
        .get("/api/users/getUserById")
        .set("Authorization", `Bearer ${token}`)
        .query({ id: user.id })
        .expect(200);

      expect(response.body).toMatchObject({
        user: {
          username: "useridtest",
          role: "user",
        },
      });
    });

    it("should return 404 if user is not found", async () => {
      const response = await request(app)
        .get("/api/users/getUserById")
        .query({ id: 999 })
        .expect(404);

      expect(response.body).toEqual({
        error: "Usuario no encontrado",
      });
    });
  });
});
