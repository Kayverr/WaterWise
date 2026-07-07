import {
  insertEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../models/EventModel.js";


// CREATE EVENT
export function createEvent(eventData) {
  return insertEvent(eventData);
}


// READ EVENTS
export function readEvents() {
  return getEvents();
}


// UPDATE EVENT
export function editEvent(id, eventData) {
  const updatedEvent = updateEvent(
    id,
    eventData
  );

  if (!updatedEvent) {
    throw new Error("Event not found.");
  }

  return updatedEvent;
}


// DELETE EVENT
export function removeEvent(id) {
  const deleted = deleteEvent(id);

  if (!deleted) {
    throw new Error("Event not found.");
  }

  return {
    message: "Event deleted successfully.",
  };
}