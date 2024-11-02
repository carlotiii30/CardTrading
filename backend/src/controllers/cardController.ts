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
) => {
  const { id } = req.query;

  try {
    const card = await Card.findByPk(id as string);
    if (!card) {
      return res.status(404).json({ error: "Carta no encontrada" });
    }
    res.json(card);
  } catch (error) {
    console.error("Error al obtener la carta:", error);
    next(error);
  }
};

// Eliminar una carta por ID
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  try {
    const card = await Card.findByPk(id as string);
    if (!card) {
      return res.status(404).json({ error: "Carta no encontrada" });
    }
    await card.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar la carta:", error);
    next(error);
  }
};
