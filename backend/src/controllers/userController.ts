import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index";
import { userSchema } from "../services/validationSchemas";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password, role } = req.query;

  const { error } = userSchema.validate({ username, password, role });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  try {
    const encryptedPassword = await bcrypt.hash(password as string, 10);
    const user = await User.create({
      username: username as string,
      password: encryptedPassword,
      role: (role as string) || "user",
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if ((error as Error).name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "El nombre de usuario ya está en uso" });
    } else {
      console.error("Error al registrar el usuario:", error);
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
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password as string,
      user.password
    );
    if (!isPasswordValid) {
      res.status(401).json({ error: "Contraseña incorrecta" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ user, token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    next(error);
  }
};

export const getProfile = (req: Request, res: Response): void => {
  const user = req.user;
  res.json({ user });
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};
