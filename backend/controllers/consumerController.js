import { consumerService } from '../services/consumerService.js';
import { getCurrentUser } from '../services/AuthService.js';
import { consumerModel } from '../models/consumerModel.js';

export const getProfile = async (req, res) => {
  try {
    const user = req.user ?? await getCurrentUser();
    const profileId = user.id;
    const profile = await consumerService.getProfile(profileId);

    return res.status(200).json(profile);
  } catch (error) {
    if (error.code === 'UNAUTHORIZED') {
      return res.status(401).json({ error: 'Unauthorized', message: error.message });
    }

    if (error.code === 'PROFILE_NOT_FOUND') {
      return res.status(404).json({ error: 'Not Found', message: error.message });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to retrieve the consumer profile.'
    });
  }
};

export const getConsumerProfile = getProfile;

export const createConsumer = async (req, res) => {
  try {
    const consumer = await consumerService.createConsumer(req.body);
    return res.status(201).json({
      message: "Consumer created successfully.",
      data: consumer,
    });
  } catch (error) {
    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    if (error.code === "23505") {
      return res.status(409).json({ message: "A consumer with this email already exists." });
    }

    return res.status(500).json({ message: "Unable to create consumer." });
  }
};

export const updateConsumer = async (req, res) => {
  try {
    const consumer = await consumerService.updateConsumer(Number(req.params.id), req.body);
    return res.status(200).json({ message: "Consumer updated successfully.", data: consumer });
  } catch (error) {
    if (error.code === "VALIDATION_ERROR") return res.status(400).json({ message: error.message, errors: error.errors });
    if (error.code === "CONSUMER_NOT_FOUND") return res.status(404).json({ message: error.message });
    if (error.code === "23505") return res.status(409).json({ message: "A consumer with this email already exists." });
    return res.status(500).json({ message: "Unable to update consumer." });
  }
};

export const getConsumerDirectory = async (_req, res) => {
  try {
    return res.status(200).json({ data: await consumerModel.listDirectory() });
  } catch {
    return res.status(500).json({ message: "Unable to load the consumer directory." });
  }
};
