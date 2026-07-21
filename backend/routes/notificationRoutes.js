import express from 'express';
import { authenticateWithUser } from '../middleware/AuthMiddleware.js';
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
  resetNotifications
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/api/notifications', authenticateWithUser, getNotifications);
router.put('/api/notifications/:id/read', authenticateWithUser, markNotificationAsRead);
router.delete('/api/notifications/:id', authenticateWithUser, deleteNotification);

if (process.env.WATERWISE_E2E === 'true') {
  router.post('/api/test/notifications/reset', resetNotifications);
}

export default router;
