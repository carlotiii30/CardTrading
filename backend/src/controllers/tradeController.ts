import { NextFunction, Request, Response } from "express";
import { Card, Trade, User } from "../models/index";
import { Op } from "sequelize";
import logger from "../config/logger";

export const requestTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offeredCardId, requestedCardId } = req.query;
  const offeredUserId = req.user?.id;

  if (!offeredUserId) {
    logger.warn("RequestTrade: Usuario no autenticado.");
    res.status(401).json({ error: "Usuario no autenticado" });
    return;
  }

  try {
    logger.info(
      `RequestTrade: Usuario ${offeredUserId} solicitando intercambio.`
    );
    const offeredUser = await User.findByPk(offeredUserId);
    if (!offeredUser) {
      logger.warn(
        `RequestTrade: Usuario que ofrece no encontrado: ${offeredUserId}.`
      );
      res.status(404).json({ error: "Usuario que ofrece no encontrado" });
      return;
    }

    const offerCard = await Card.findByPk(offeredCardId as string);
    if (!offerCard) {
      logger.warn(
        `RequestTrade: Carta de oferta no encontrada: ${offeredCardId}.`
      );
      res.status(404).json({ error: "Carta de oferta no encontrada" });
      return;
    }

    const requestCard = await Card.findByPk(requestedCardId as string);
    if (!requestCard) {
      logger.warn(
        `RequestTrade: Carta solicitada no encontrada: ${requestedCardId}.`
      );
      res.status(404).json({ error: "Carta solicitada no encontrada" });
      return;
    }

    const trade = await Trade.create({
      offeredCardId: offeredCardId as string,
      requestedCardId: requestedCardId as string,
      offeredUserId,
      requestedUserId: requestCard.userId,
      status: "pending",
    });

    logger.info(`RequestTrade: Intercambio creado: ${trade.id}.`);
    res.status(201).json(trade);
  } catch (error) {
    logger.error(
      `RequestTrade: Error al solicitar el intercambio: ${
        (error as Error).message
      }`
    );
    next(error);
  }
};

export const acceptTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tradeId } = req.query;

  try {
    logger.info(`AcceptTrade: Aceptando intercambio: ${tradeId}.`);
    const trade = await Trade.findByPk(tradeId as string, {
      include: [
        { model: User, as: "offeredUser" },
        { model: User, as: "requestedUser" },
        { model: Card, as: "offeredCard" },
        { model: Card, as: "requestedCard" },
      ],
    });

    if (!trade) {
      logger.warn(`AcceptTrade: Intercambio no encontrado: ${tradeId}.`);
      res.status(404).json({ error: "Intercambio no encontrado" });
      return;
    }

    if (trade.status !== "pending") {
      logger.warn(`AcceptTrade: Intercambio no pendiente: ${tradeId}.`);
      res.status(400).json({ error: "El intercambio no está pendiente" });
      return;
    }

    trade.status = "accepted";
    await trade.save();

    const requestCard = await Card.findByPk(trade.requestedCardId);
    if (requestCard) {
      requestCard.userId = trade.offeredUserId;
      await requestCard.save();
    }

    const offeredCard = await Card.findByPk(trade.offeredCardId);
    if (offeredCard) {
      offeredCard.userId = trade.requestedUserId;
      await offeredCard.save();
    }

    logger.info(`AcceptTrade: Intercambio aceptado y cartas actualizadas.`);
    res.json({ message: "Intercambio aceptado y carta actualizada" });
  } catch (error) {
    logger.error(
      `AcceptTrade: Error al aceptar el intercambio: ${
        (error as Error).message
      }`
    );
    next(error);
  }
};

export const cancelTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tradeId } = req.query;

  try {
    logger.info(`CancelTrade: Cancelando intercambio: ${tradeId}.`);
    const trade = await Trade.findByPk(tradeId as string);
    if (!trade) {
      logger.warn(`CancelTrade: Intercambio no encontrado: ${tradeId}.`);
      res.status(404).json({ error: "Intercambio no encontrado" });
      return;
    }

    await trade.destroy();
    logger.info(`CancelTrade: Intercambio cancelado: ${tradeId}.`);
    res.status(204).send();
  } catch (error) {
    logger.error(
      `CancelTrade: Error al cancelar el intercambio: ${
        (error as Error).message
      }`
    );
    next(error);
  }
};

export const getTrades = async (req: Request, res: Response) => {
  try {
    logger.info("GetTrades: Obteniendo todos los intercambios.");
    const trades = await Trade.findAll({
      include: [
        { model: User, as: "offeredUser" },
        { model: User, as: "requestedUser" },
        { model: Card, as: "offeredCard" },
        { model: Card, as: "requestedCard" },
      ],
    });

    logger.info(`GetTrades: Se recuperaron ${trades.length} intercambios.`);
    res.json(trades);
  } catch (error) {
    logger.error(
      `GetTrades: Error al obtener los intercambios: ${
        (error as Error).message
      }`
    );
    res.status(500).json({ error: "Error al obtener los intercambios" });
  }
};

export const getTrade = async (req: Request, res: Response) => {
  const { tradeId } = req.query;

  try {
    logger.info(`GetTrade: Obteniendo intercambio: ${tradeId}.`);
    const trade = await Trade.findByPk(tradeId as string, {
      include: [
        { model: User, as: "offeredUser" },
        { model: User, as: "requestedUser" },
        { model: Card, as: "offeredCard" },
        { model: Card, as: "requestedCard" },
      ],
    });

    if (!trade) {
      logger.warn(`GetTrade: Intercambio no encontrado: ${tradeId}.`);
      res.status(404).json({ error: "Intercambio no encontrado" });
      return;
    }

    logger.info(`GetTrade: Intercambio recuperado: ${trade.id}.`);
    res.json(trade);
  } catch (error) {
    logger.error(
      `GetTrade: Error al obtener el intercambio: ${(error as Error).message}`
    );
    res.status(500).json({ error: "Error al obtener el intercambio" });
  }
};

export const getUserTrades = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    logger.warn("GetUserTrades: Usuario no autenticado.");
    res.status(401).json({ error: "Usuario no autenticado" });
    return;
  }

  try {
    logger.info(
      `GetUserTrades: Obteniendo intercambios del usuario: ${userId}.`
    );
    const trades = await Trade.findAll({
      where: {
        [Op.or]: [{ offeredUserId: userId }, { requestedUserId: userId }],
      },
      include: [
        { model: User, as: "offeredUser" },
        { model: User, as: "requestedUser" },
        { model: Card, as: "offeredCard" },
        { model: Card, as: "requestedCard" },
      ],
    });

    logger.info(
      `GetUserTrades: Usuario ${userId} tiene ${trades.length} intercambios.`
    );
    res.json(trades);
  } catch (error) {
    logger.error(
      `GetUserTrades: Error al obtener intercambios: ${
        (error as Error).message
      }`
    );
    res
      .status(500)
      .json({ error: "Error al obtener los intercambios del usuario" });
  }
};
