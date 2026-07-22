import express from 'express';
import { createConsumer, updateConsumer, getProfile, getConsumerDirectory } from '../controllers/consumerController.js';

const router = express.Router();

router.get('/api/profile', getProfile);
router.get('/api/consumers', getConsumerDirectory);
router.post('/api/consumers', createConsumer);
router.put('/api/consumers/:id', updateConsumer);

export default router;
