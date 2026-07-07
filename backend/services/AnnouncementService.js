import {
  insertAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../models/AnnouncementModel.js";


// CREATE ANNOUNCEMENT
export function createAnnouncement(
  announcementData
) {
  return insertAnnouncement(
    announcementData
  );
}


// READ ANNOUNCEMENTS
export function readAnnouncements() {
  return getAnnouncements();
}


// UPDATE ANNOUNCEMENT
export function editAnnouncement(
  id,
  announcementData
) {
  const updatedAnnouncement =
    updateAnnouncement(
      id,
      announcementData
    );


  if (!updatedAnnouncement) {
    throw new Error(
      "Announcement not found."
    );
  }


  return updatedAnnouncement;
}


// DELETE ANNOUNCEMENT
export function removeAnnouncement(
  id
) {
  const deleted =
    deleteAnnouncement(id);


  if (!deleted) {
    throw new Error(
      "Announcement not found."
    );
  }


  return {
    message:
      "Announcement deleted successfully.",
  };
}