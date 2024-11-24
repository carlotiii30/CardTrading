import { Request, Response, NextFunction } from "express";
import { Card } from "../models/index";
import logger from "../config/logger";

// Crear una nueva carta
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      logger.error("Attempt to create card without authentication");
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

    logger.info(
      `Card created: ${card.name}, ID: ${card.id}, UserID: ${userId}`
    );
    res.status(201).json(card);
  } catch (error) {
    logger.error(`Error creating card: ${(error as Error).message}`);
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
    logger.info(`Retrieved ${cards.length} cards`);
    res.json(cards);
  } catch (error) {
    logger.error(`Error retrieving cards: ${(error as Error).message}`);
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
      logger.error("Attempt to retrieve user cards without authentication");
      return next(new Error("User not authenticated"));
    }

    const cards = await Card.findAll({ where: { userId: req.user.id } });
    logger.info(`Retrieved ${cards.length} cards for user ID: ${req.user.id}`);
    res.json(cards);
  } catch (error) {
    logger.error(
      `Error retrieving cards for user ID: ${req.user?.id}. Error: ${
        (error as Error).message
      }`
    );
    next(error);
  }
};

// Obtener una carta por ID
export const getCardById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.query;

  try {
    logger.info(`Fetching card with ID: ${id}`);
    const card = await Card.findByPk(id as string);
    if (!card) {
      logger.warn(`Card with ID: ${id} not found`);
      res.status(404).json({ error: "Carta no encontrada" });
      return;
    }
    logger.info(`Card found: ${card.name}, ID: ${card.id}`);
    res.json(card);
  } catch (error) {
    logger.error(
      `Error fetching card with ID: ${id}. Error: ${(error as Error).message}`
    );
    next(error);
  }
};

// Eliminar una carta por ID
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.query;

  try {
    logger.info(`Attempting to delete card with ID: ${id}`);
    const card = await Card.findByPk(id as string);
    if (!card) {
      logger.warn(`Card with ID: ${id} not found for deletion`);
      res.status(404).json({ error: "Carta no encontrada" });
      return;
    }
    await card.destroy();
    logger.info(`Card deleted: ID: ${id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(
      `Error deleting card with ID: ${id}. Error: ${(error as Error).message}`
    );
    next(error);
  }
};
