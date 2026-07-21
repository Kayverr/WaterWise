import { notificationModel } from '../models/notificationModel.js';
import { notificationService } from '../services/notificationService.js';

export const getNotifications = async (req, res) => {
  try {
    const payload = await notificationService.getUserNotifications(req.user.id);
    return res.status(200).json(payload);
  } catch {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to retrieve notifications.'
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { errorType, data } = await notificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    if (errorType === 'NOT_FOUND') return res.status(404).json(data);
    if (errorType === 'FORBIDDEN') return res.status(403).json(data);

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to update the notification.'
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { errorType, data } = await notificationService.delete(
      req.params.id,
      req.user.id
    );

    if (errorType === 'NOT_FOUND') return res.status(404).json(data);
    if (errorType === 'FORBIDDEN') return res.status(403).json(data);

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to delete the notification.'
    });
  }
};

export const resetNotifications = (_req, res) => {
  notificationModel.__resetStorage();
  return res.status(204).end();
};
