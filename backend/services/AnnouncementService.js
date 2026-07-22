import {

  insertAnnouncement,
  getAnnouncements,
  findAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,

} from "../models/AnnouncementModel.js";


import {
  validateAnnouncement,
} from "../validation/AnnouncementValidation.js";



// CREATE
export function createAnnouncement(
  announcementData
) {


  const validation =
    validateAnnouncement(
      announcementData
    );


  if (!validation.isValid) {

    throw new Error(
      JSON.stringify(
        validation.errors
      )
    );

  }


  return insertAnnouncement(
    announcementData
  );

}




// READ ALL
export function readAnnouncements() {

  return getAnnouncements();

}




// SEARCH
export function searchAnnouncement(
  id
) {


  const announcement =
    findAnnouncementById(id);



  if (announcement && typeof announcement.then === "function") {
    return announcement.then((record) => {
      if (!record) throw new Error("Announcement not found.");
      return record;
    });
  }

  if (!announcement) {

    throw new Error(
      "Announcement not found."
    );

  }


  return announcement;

}





// UPDATE
export function editAnnouncement(
  id,
  announcementData
) {


  // Check existing record

  const existing = searchAnnouncement(id);



  const validation =
    validateAnnouncement(
      announcementData
    );


  if (!validation.isValid) {

    throw new Error(
      JSON.stringify(
        validation.errors
      )
    );

  }



  if (existing && typeof existing.then === "function") {
    return existing.then(() => updateAnnouncement(id, announcementData));
  }

  return updateAnnouncement(id, announcementData);

}





// DELETE
export function removeAnnouncement(
  id
) {


  // Check existing record

  const existing = searchAnnouncement(id);
  const result = {

    message:
      "Announcement deleted successfully.",

  };

  if (existing && typeof existing.then === "function") {
    return existing.then(() => deleteAnnouncement(id)).then(() => result);
  }

  deleteAnnouncement(id);
  return result;

}
