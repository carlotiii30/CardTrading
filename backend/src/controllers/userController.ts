import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index";
import { userSchema } from "../services/validationSchemas";
import logger from "../config/logger";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password, role } = req.query;

  const { error } = userSchema.validate({ username, password, role });
  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, "");
    logger.warn(`Validation error during registration: ${errorMessage}`);
    res.status(400).json({ error: errorMessage });
    return;
  }

  try {
    logger.info(`Registering user: ${username}`);
    const encryptedPassword = await bcrypt.hash(password as string, 10);
    const user = await User.create({
      username: username as string,
      password: encryptedPassword,
      role: (role as string) || "user",
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    logger.info(`User registered successfully: ${user.username}`);
    res.status(201).json({ user, token });
  } catch (error) {
    if ((error as Error).name === "SequelizeUniqueConstraintError") {
      logger.warn(`Registration failed: Username ${username} already in use`);
      res.status(400).json({ error: "El nombre de usuario ya está en uso" });
    } else {
      logger.error(`Error during registration: ${(error as Error).message}`);
      next(error);
    }
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password } = req.query;

  if (!username || !password) {
    logger.warn("Login attempt with missing credentials");
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  try {
    logger.info(`User attempting to log in: ${username}`);
    const user = await User.findOne({ where: { username } });

    if (!user) {
      logger.warn(`Login failed: Username ${username} not found`);
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password as string,
      user.password
    );
    if (!isPasswordValid) {
      logger.warn(`Login failed: Incorrect password for username ${username}`);
      res.status(401).json({ error: "Contraseña incorrecta" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    logger.info(`User logged in successfully: ${username}`);
    res.json({ user, token });
  } catch (error) {
    logger.error(
      `Error during login for user ${username}: ${(error as Error).message}`
    );
    next(error);
  }
};

export const getProfile = (req: Request, res: Response): void => {
  const user = req.user;

  if (user) {
    logger.info(`Retrieved profile for user ID: ${user.id}`);
  } else {
    logger.warn("Attempt to retrieve profile without authentication");
  }

  res.json({ user });
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info("Fetching all users");
    const users = await User.findAll();
    logger.info(`Retrieved ${users.length} users`);
    res.json({ users });
  } catch (error) {
    logger.error(`Error fetching users: ${(error as Error).message}`);
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.query;

  try {
    logger.info(`Fetching user by ID: ${id}`);

    if (typeof id !== "string") {
      logger.warn(`Invalid ID format: ${id}`);
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      logger.warn(`User with ID: ${id} not found`);
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    logger.info(`User retrieved: ID: ${id}, Username: ${user.username}`);
    res.json({ user });
  } catch (error) {
    logger.error(
      `Error fetching user by ID: ${id}. Error: ${(error as Error).message}`
    );
    next(error);
  }
};
