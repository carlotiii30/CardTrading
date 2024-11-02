import { NextFunction, Request, Response } from "express";
import { Card, Trade, User } from "../models/index";
import { Op } from "sequelize";

export const requestTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { offeredCardId, requestedCardId } = req.query;
  const offeredUserId = req.user?.id;

  if (!offeredUserId) {
    res.status(401).json({ error: "Usuario no autenticado" });
    return;
  }

  try {
    const offeredUser = await User.findByPk(offeredUserId);
    if (!offeredUser) {
      res.status(404).json({ error: "Usuario que ofrece no encontrado" });
      return;
    }

    const offerCard = await Card.findByPk(offeredCardId as string);
    if (!offerCard) {
      res.status(404).json({ error: "Carta de oferta no encontrada" });
      return;
    }

    const requestCard = await Card.findByPk(requestedCardId as string);
    if (!requestCard) {
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

    res.status(201).json(trade);
  } catch (error) {
    console.error("Error al solicitar el intercambio:", error);
    next(error);
  }
};

export const acceptTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tradeId } = req.query;

  try {
    const trade = await Trade.findByPk(tradeId as string, {
      include: [
        { model: User, as: "offeredUser" },
        { model: User, as: "requestedUser" },
        { model: Card, as: "offeredCard" },
        { model: Card, as: "requestedCard" },
      ],
    });

    if (!trade) {
      return res.status(404).json({ error: "Intercambio no encontrado" });
    }

    if (trade.status !== "pending") {
      return res
        .status(400)
        .json({ error: "El intercambio no está pendiente" });
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

    res.json({ message: "Intercambio aceptado y carta actualizada" });
  } catch (error) {
    console.error("Error al aceptar el intercambio:", error);
    next(error);
  }
};

export const cancelTrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tradeId } = req.query;

  try {
    const trade = await Trade.findByPk(tradeId as string);
    if (!trade) {
      return res.status(404).json({ error: "Intercambio no encontrado" });
    }

    await trade.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error al cancelar el intercambio:", error);
    next(error);
  }
};

export const getTrades = async (req: Request, res: Response) => {
  try {
    const trades = await Trade.findAll({
      include: [
        { model: User, as: "offeredUser" },
        { model: User, as: "requestedUser" },
        { model: Card, as: "offeredCard" },
        { model: Card, as: "requestedCard" },
      ],
    });

    res.json(trades);
  } catch (error) {
    console.error("Error al obtener los intercambios:", error);
    res.status(500).json({ error: "Error al obtener los intercambios" });
  }
};

export const getTrade = async (req: Request, res: Response) => {
  const { tradeId } = req.query;

  try {
    const trade = await Trade.findByPk(tradeId as string, {
      include: [User, Card],
    });

    if (!trade) {
      res.status(404).json({ error: "Intercambio no encontrado" });
      return;
    }

    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el intercambio" });
  }
};

export const getUserTrades = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Usuario no autenticado" });
    return;
  }

  try {
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

    res.json(trades);
  } catch (error) {
    console.error("Error al obtener los intercambios del usuario:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los intercambios del usuario" });
  }
};
