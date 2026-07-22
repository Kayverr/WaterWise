import express from "express";
import {
  getAnnouncements,
  getAnnouncement,
  postAnnouncement,
  patchAnnouncement,
  removeAnnouncementById,
} from "../controllers/announcementController.js";

const router = express.Router();

router.get("/", getAnnouncements);
router.get("/:id", getAnnouncement);
router.post("/", postAnnouncement);
router.put("/:id", patchAnnouncement);
router.patch("/:id", patchAnnouncement);
router.delete("/:id", removeAnnouncementById);

export default router;
