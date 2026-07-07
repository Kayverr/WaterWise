import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";


vi.mock("../models/EventModel.js", () => ({
  insertEvent: vi.fn(),
  getEvents: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));


import * as eventModel from "../models/EventModel.js";

import {
  createEvent,
  readEvents,
  editEvent,
  removeEvent,
} from "../services/EventService.js";


describe("Event Service", () => {


  beforeEach(() => {
    vi.clearAllMocks();
  });



  describe("Create Event", () => {


    it("should create event successfully", () => {

      // Arrange
      const mockEvent = {
        id: 1,
        title: "Barangay Assembly",
        description:
          "Monthly community meeting.",
        date: "2026-07-10",
        time: "09:00 AM",
        location: "Barangay Hall",
        tags: [
          "Community",
        ],
        status: "Upcoming",
      };


      eventModel.insertEvent.mockReturnValue(
        mockEvent
      );


      // Act
      const result = createEvent(
        mockEvent
      );


      // Assert
      expect(
        result
      ).toEqual(mockEvent);


      expect(
        eventModel.insertEvent
      ).toHaveBeenCalledOnce();

    });


  });



  describe("Read Events", () => {


    it("should return all event records", () => {


      // Arrange
      const mockEvents = [
        {
          id: 1,
          title: "Water System Maintenance",
        },
      ];


      eventModel.getEvents.mockReturnValue(
        mockEvents
      );


      // Act
      const result = readEvents();


      // Assert
      expect(result)
        .toEqual(mockEvents);


      expect(
        eventModel.getEvents
      ).toHaveBeenCalledOnce();


    });


  });



  describe("Update Event", () => {


    it("should update event successfully", () => {


      // Arrange
      const updatedEvent = {
        id: 1,
        title: "Updated Event",
      };


      eventModel.updateEvent.mockReturnValue(
        updatedEvent
      );


      // Act
      const result = editEvent(
        1,
        updatedEvent
      );


      // Assert
      expect(result)
        .toEqual(updatedEvent);


      expect(
        eventModel.updateEvent
      ).toHaveBeenCalledWith(
        1,
        updatedEvent
      );


    });



    it("should throw error when event does not exist", () => {


      // Arrange
      eventModel.updateEvent.mockReturnValue(
        null
      );


      // Act + Assert
      expect(() =>
        editEvent(
          999,
          {
            title: "Invalid",
          }
        )
      ).toThrow(
        "Event not found."
      );


    });


  });



  describe("Delete Event", () => {


    it("should delete event successfully", () => {


      // Arrange
      eventModel.deleteEvent.mockReturnValue(
        true
      );


      // Act
      const result = removeEvent(1);


      // Assert
      expect(result)
        .toEqual({
          message:
            "Event deleted successfully.",
        });


      expect(
        eventModel.deleteEvent
      ).toHaveBeenCalledWith(1);


    });



    it("should throw error when event does not exist", () => {


      // Arrange
      eventModel.deleteEvent.mockReturnValue(
        false
      );


      // Act + Assert
      expect(() =>
        removeEvent(999)
      ).toThrow(
        "Event not found."
      );


    });


  });


});