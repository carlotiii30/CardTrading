import { Request, Response, NextFunction } from "express";
import { Card } from "../models/index";

// Crear una nueva carta
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new Error("User not authenticated"));
    }

    const { name, type, description } = req.body;
    const userId = req.user.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const card = await Card.create({
      name,
      type,
      image: imageUrl,
      description,
      userId,
    });

    res.status(201).json(card);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las cartas de la base de datos
export const getAllCards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cards = await Card.findAll();
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

// Obtener todas las cartas del usuario autenticado
export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new Error("User not authenticated"));
    }

    const cards = await Card.findAll({ where: { userId: req.user.id } });
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

// Obtener una carta por ID
export const getCardById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new Error("User not authenticated"));
    }

    const card = await Card.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (card) {
      res.json(card);
    } else {
      res.status(404).send("Card not found");
    }
  } catch (error) {
    next(error);
  }
};

// Eliminar una carta por ID
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new Error("User not authenticated"));
    }

    const deleted = await Card.destroy({
      where: { id: req.query.id, userId: req.user.id },
    });

    if (deleted) {
      res.json({ message: "Carta eliminada" });
    } else {
      res.status(404).send("Card not found");
    }
  } catch (error) {
    next(error);
  }
};
