import express from "express";
import { body } from "express-validator";
import { refreshAccessToken } from "../controllers/auth.js";

const router = express.Router();

// refresh access token route
router.get('/refresh/user', refreshAccessToken);

export default router