import mockAnnouncementData from "../data/mockAnnouncementData.js";


// CREATE
export function insertAnnouncement(
  announcement
) {
  const newAnnouncement = {
    id: mockAnnouncementData.length + 1,
    ...announcement,
  };

  mockAnnouncementData.push(
    newAnnouncement
  );

  return newAnnouncement;
}


// READ
export function getAnnouncements() {
  return mockAnnouncementData;
}


// UPDATE
export function updateAnnouncement(
  id,
  updatedAnnouncement
) {
  const index =
    mockAnnouncementData.findIndex(
      (announcement) =>
        announcement.id === id
    );


  if (index === -1) {
    return null;
  }


  mockAnnouncementData[index] = {
    ...mockAnnouncementData[index],
    ...updatedAnnouncement,
  };


  return mockAnnouncementData[index];
}


// DELETE
export function deleteAnnouncement(
  id
) {
  const index =
    mockAnnouncementData.findIndex(
      (announcement) =>
        announcement.id === id
    );


  if (index === -1) {
    return false;
  }


  mockAnnouncementData.splice(
    index,
    1
  );


  return true;
}