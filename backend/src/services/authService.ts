import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/index";

// Middleware de manejo de errores
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(500).json({ error: err.message });
};

// Middleware de autenticación
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Acceso denegado" });
    return;
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    req.user = verified as User;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token no válido" });
  }
};
