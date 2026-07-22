import {
  createAnnouncement,
  readAnnouncements,
  searchAnnouncement,
  editAnnouncement,
  removeAnnouncement,
} from "../services/AnnouncementService.js";

function errorResponse(res, error) {
  if (error.message === "Announcement not found.") {
    return res.status(404).json({ message: error.message });
  }
  try {
    return res.status(400).json({ message: "Validation failed.", errors: JSON.parse(error.message) });
  } catch {
    return res.status(500).json({ message: error.message || "Announcement request failed." });
  }
}

export async function getAnnouncements(_req, res) {
  try {
    return res.status(200).json({ data: await readAnnouncements() });
  } catch (error) {
    return errorResponse(res, error);
  }
}

export async function getAnnouncement(req, res) {
  try {
    return res.status(200).json({ data: await searchAnnouncement(Number(req.params.id)) });
  } catch (error) {
    return errorResponse(res, error);
  }
}

export async function postAnnouncement(req, res) {
  try {
    const announcement = await createAnnouncement(req.body);
    return res.status(201).json({ message: "Announcement published successfully.", data: announcement });
  } catch (error) {
    return errorResponse(res, error);
  }
}

export async function patchAnnouncement(req, res) {
  try {
    const announcement = await editAnnouncement(Number(req.params.id), req.body);
    return res.status(200).json({ message: "Announcement updated successfully.", data: announcement });
  } catch (error) {
    return errorResponse(res, error);
  }
}

export async function removeAnnouncementById(req, res) {
  try {
    return res.status(200).json(await removeAnnouncement(Number(req.params.id)));
  } catch (error) {
    return errorResponse(res, error);
  }
}
