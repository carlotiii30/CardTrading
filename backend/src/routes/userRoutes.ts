import { Router } from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getUsers,
  getUserById,
} from "../controllers/userController";
import { authenticateToken } from "../services/authService";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations about users
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the new user
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: Password of the new user
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: true
 *         description: Role of the new user
 *     responses:
 *       201:
 *         description: A new user has been created
 *       400:
 *         description: Error in user creation
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of the user
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: Password of the user
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Error in login
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/users/getProfile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized user
 */
router.get("/getProfile", authenticateToken, getProfile);

/**
 * @swagger
 * /api/users/getUsers:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized user
 */
router.get("/getUsers", getUsers);

/**
 * @swagger
 * /api/users/getUserById:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/getUserById", getUserById);

export default router;
