import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";


vi.mock("../models/AnnouncementModel.js", () => ({
  insertAnnouncement: vi.fn(),
  getAnnouncements: vi.fn(),
  updateAnnouncement: vi.fn(),
  deleteAnnouncement: vi.fn(),
}));


import * as announcementModel from "../models/AnnouncementModel.js";


import {
  createAnnouncement,
  readAnnouncements,
  editAnnouncement,
  removeAnnouncement,
} from "../services/AnnouncementService.js";



describe("Announcement Service", () => {


  beforeEach(() => {
    vi.clearAllMocks();
  });



  describe("Create Announcement", () => {


    it("should create announcement successfully", () => {

      // Arrange
      const mockAnnouncement = {
        id: 1,
        title:
          "Water Interruption Notice",
        content:
          "Water service unavailable tomorrow.",
        publicationDate:
          "2026-07-05",
        relatedEvent:
          "Water System Maintenance",
      };


      announcementModel
        .insertAnnouncement
        .mockReturnValue(
          mockAnnouncement
        );


      // Act
      const result =
        createAnnouncement(
          mockAnnouncement
        );


      // Assert
      expect(result)
        .toEqual(mockAnnouncement);


      expect(
        announcementModel.insertAnnouncement
      )
        .toHaveBeenCalledOnce();

    });


  });



  describe("Read Announcements", () => {


    it("should return all announcements", () => {

      // Arrange
      const mockAnnouncements = [
        {
          id: 1,
          title:
            "Barangay Assembly Reminder",
        },
      ];


      announcementModel
        .getAnnouncements
        .mockReturnValue(
          mockAnnouncements
        );


      // Act
      const result =
        readAnnouncements();


      // Assert
      expect(result)
        .toEqual(mockAnnouncements);


      expect(
        announcementModel.getAnnouncements
      )
        .toHaveBeenCalledOnce();

    });


  });



  describe("Update Announcement", () => {


    it("should update announcement successfully", () => {

      // Arrange
      const updatedAnnouncement = {
        id: 1,
        title:
          "Updated Announcement",
      };


      announcementModel
        .updateAnnouncement
        .mockReturnValue(
          updatedAnnouncement
        );


      // Act
      const result =
        editAnnouncement(
          1,
          updatedAnnouncement
        );


      // Assert
      expect(result)
        .toEqual(updatedAnnouncement);


      expect(
        announcementModel.updateAnnouncement
      )
        .toHaveBeenCalledWith(
          1,
          updatedAnnouncement
        );

    });



    it("should throw error when announcement does not exist", () => {

      // Arrange
      announcementModel
        .updateAnnouncement
        .mockReturnValue(
          null
        );


      // Act + Assert
      expect(() =>
        editAnnouncement(
          999,
          {
            title:
              "Invalid",
          }
        )
      )
      .toThrow(
        "Announcement not found."
      );

    });


  });



  describe("Delete Announcement", () => {


    it("should delete announcement successfully", () => {

      // Arrange
      announcementModel
        .deleteAnnouncement
        .mockReturnValue(
          true
        );


      // Act
      const result =
        removeAnnouncement(1);


      // Assert
      expect(result)
        .toEqual({
          message:
            "Announcement deleted successfully.",
        });


      expect(
        announcementModel.deleteAnnouncement
      )
        .toHaveBeenCalledWith(1);

    });



    it("should throw error when announcement does not exist", () => {

      // Arrange
      announcementModel
        .deleteAnnouncement
        .mockReturnValue(
          false
        );


      // Act + Assert
      expect(() =>
        removeAnnouncement(999)
      )
      .toThrow(
        "Announcement not found."
      );

    });


  });


});