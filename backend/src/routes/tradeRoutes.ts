import { Router } from "express";
import {
  requestTrade,
  acceptTrade,
  getTrades,
  cancelTrade,
  getTrade,
  getUserTrades,
} from "../controllers/tradeController";
import { authenticateToken } from "../services/authService";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Trades
 *   description: Operations about trades
 */

/**
 * @swagger
 * /api/trades/requestTrade:
 *   post:
 *     summary: Request a trade
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: requestedCardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the card requested
 *       - in: query
 *         name: offeredCardId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the card offered
 *     responses:
 *       200:
 *         description: Trade request
 *       401:
 *         description: Unauthorized user
 *       404:
 *         description: Card not found
 */
router.post("/requestTrade", authenticateToken, requestTrade);

/**
 * @swagger
 * /api/trades/acceptTrade:
 *   post:
 *     summary: Accept a trade
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tradeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the trade
 *     responses:
 *       200:
 *         description: Trade accepted
 *       401:
 *         description: Unauthorized user
 */
router.post("/acceptTrade", authenticateToken, acceptTrade);

/**
 * @swagger
 * /api/trades/getTrades:
 *   get:
 *     summary: Get all trades
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trades list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trade'
 *       401:
 *         description: Unauthorized user
 */
router.get("/getTrades", authenticateToken, getTrades);

/**
 * @swagger
 * /api/trades/cancelTrade:
 *   post:
 *     summary: Cancel a trade
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tradeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the trade
 *     responses:
 *       200:
 *         description: Trade canceled
 *       401:
 *         description: Unauthorized user
 */
router.post("/cancelTrade", authenticateToken, cancelTrade);

/**
 * @swagger
 * /api/trades/getTrade:
 *   get:
 *     summary: Get a trade
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tradeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the trade
 *     responses:
 *       200:
 *         description: Trade details
 *       401:
 *         description: Unauthorized user
 *       404:
 *         description: Trade not found
 */
router.get("/getTrade", authenticateToken, getTrade);

/**
 * @swagger
 * /api/trades/getUserTrades:
 *   get:
 *     summary: Get trades for the authenticated user
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trades for the authenticated user
 *       401:
 *         description: Unauthorized user
 *       500:
 *         description: Error retrieving trades
 */
router.get("/getUserTrades", authenticateToken, getUserTrades);

export default router;
