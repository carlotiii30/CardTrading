import { Router } from "express";
import {
  getCards,
  getAllCards,
  getCardById,
  createCard,
  deleteCard,
} from "../controllers/cardController";
import { authenticateToken } from "../services/authService";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only JPEG, PNG, and JPG are allowed"));
    }
  },
});

const router = Router();

/**
 * @swagger
 * /api/cards/createCard:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the card
 *               type:
 *                 type: string
 *                 description: Type of the card
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the card
 *               description:
 *                 type: string
 *                 description: Description of the card
 *     responses:
 *       201:
 *         description: New card created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Unauthorized user
 */
router.post(
  "/createCard",
  authenticateToken,
  upload.single("image"),
  createCard
);

/**
 * @swagger
 * /api/cards/getAllCards:
 *   get:
 *     summary: Return all cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: An array of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
router.get("/getAllCards", getAllCards);

/**
 * @swagger
 * /api/cards/getCards:
 *   get:
 *     summary: Return user's cards
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       401:
 *         description: Unauthorized user
 */
router.get("/getCards", authenticateToken, getCards);

/**
 * @swagger
 * /api/cards/getCard:
 *   get:
 *     summary: Return a card by ID
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the card
 *     responses:
 *       200:
 *         description: A card by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Unauthorized user
 *       404:
 *         description: Card not found
 */
router.get("/getCard", authenticateToken, getCardById);

/**
 * @swagger
 * /api/cards/deleteCard:
 *   delete:
 *     summary: Delete a card by ID
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the card
 *     responses:
 *       204:
 *         description: Card deleted
 *       401:
 *         description: Unauthorized user
 *       404:
 *         description: Card not found
 */
router.delete("/deleteCard", authenticateToken, deleteCard);

export default router;
