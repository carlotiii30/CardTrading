import { Request, Response } from "express";
import { Card, Trade, User } from "../models/index";

export const requestTrade = async (req: Request, res: Response) => {
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

    const requestedCard = await Card.findByPk(requestedCardId as string);
    if (!requestedCard) {
      res.status(404).json({ error: "Carta solicitada no encontrada" });
      return;
    }

    const requestedUserId = requestedCard.userId;
    const requestedUser = await User.findByPk(requestedUserId);
    if (!requestedUser) {
      res.status(404).json({ error: "Usuario solicitado no encontrado" });
      return;
    }

    const trade = await Trade.create({
      offeredCardId: offerCard.id,
      requestedCardId: requestedCard.id,
      offeredUserId: offeredUser.id,
      requestedUserId: requestedUser.id,
    });

    res.status(201).json(trade);
  } catch (error: any) {
    console.error("Error al solicitar el intercambio:", error);
    res.status(500).json({ error: "Error al solicitar el intercambio" });
  }
};

export const acceptTrade = async (req: Request, res: Response) => {
  const { tradeId } = req.params;

  try {
    const trade = await Trade.findByPk(tradeId, {
      include: [User, Card],
    });

    if (!trade) {
      res.status(404).json({ error: "Intercambio no encontrado" });
      return;
    }

    if (trade.status !== "pending") {
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

    res.json({ message: "Intercambio aceptado y carta actualizada" });
  } catch (error) {
    res.status(500).json({ error: "Error al aceptar el intercambio" });
  }
};

export const cancelTrade = async (req: Request, res: Response) => {
  const { tradeId } = req.params;

  try {
    const trade = await Trade.findByPk(tradeId);

    if (!trade) {
      res.status(404).json({ error: "Intercambio no encontrado" });
      return;
    }

    await trade.destroy();

    res.json({ message: "Intercambio cancelado" });
  } catch (error) {
    res.status(500).json({ error: "Error al cancelar el intercambio" });
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
  const { tradeId } = req.params;

  try {
    const trade = await Trade.findByPk(tradeId, {
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
