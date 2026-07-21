import express from 'express';
import { getProfile } from '../controllers/consumerController.js';
import { authenticateWithUser } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/api/profile', authenticateWithUser, getProfile);

export default router;
