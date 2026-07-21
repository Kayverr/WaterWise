import { consumerService } from '../services/consumerService.js';

export const getProfile = async (req, res) => {
  try {
    const profile = await consumerService.getProfile(req.user.id);

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
