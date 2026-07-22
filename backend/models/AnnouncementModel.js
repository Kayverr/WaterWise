import { supabase } from "../config/supabase.js";
import mockAnnouncementData from "../data/mockAnnouncementData.js";

const TABLE = "notifications";
const columns = "id, consumer_id, announcement_type, title, announcement_date, message, created_at, updated_at";

function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}

function toDatabase(announcement) {
  return {
    consumer_id: announcement.consumerId ?? null,
    announcement_type: announcement.relatedEvent,
    title: announcement.title,
    announcement_date: announcement.publicationDate,
    message: announcement.content,
    updated_at: new Date().toISOString(),
  };
}

function fromDatabase(record) {
  return {
    id: record.id,
    consumerId: record.consumer_id,
    title: record.title,
    content: record.message,
    publicationDate: record.announcement_date,
    relatedEvent: record.announcement_type,
    status: "Published",
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export function insertAnnouncement(announcement) {
  if (process.env.NODE_ENV === "test") {
    const newAnnouncement = { id: Math.max(0, ...mockAnnouncementData.map(({ id }) => id)) + 1, ...announcement };
    mockAnnouncementData.push(newAnnouncement);
    return newAnnouncement;
  }
  return supabase.from(TABLE).insert(toDatabase(announcement)).select(columns).single()
    .then((result) => fromDatabase(unwrap(result)));
}

export function getAnnouncements() {
  if (process.env.NODE_ENV === "test") return mockAnnouncementData;
  return supabase.from(TABLE).select(columns).is("consumer_id", null)
    .order("announcement_date", { ascending: false }).order("id", { ascending: false })
    .then((result) => (unwrap(result) ?? []).map(fromDatabase));
}

export function findAnnouncementById(id) {
  if (process.env.NODE_ENV === "test") {
    return mockAnnouncementData.find((announcement) => announcement.id === Number(id));
  }
  return supabase.from(TABLE).select(columns).eq("id", id).maybeSingle()
    .then((result) => {
      const record = unwrap(result);
      return record ? fromDatabase(record) : null;
    });
}

export function updateAnnouncement(id, announcement) {
  if (process.env.NODE_ENV === "test") {
    const index = mockAnnouncementData.findIndex((item) => item.id === Number(id));
    if (index === -1) return null;
    mockAnnouncementData[index] = { ...mockAnnouncementData[index], ...announcement };
    return mockAnnouncementData[index];
  }
  return supabase.from(TABLE).update(toDatabase(announcement)).eq("id", id).select(columns).maybeSingle()
    .then((result) => {
      const record = unwrap(result);
      return record ? fromDatabase(record) : null;
    });
}

export function deleteAnnouncement(id) {
  if (process.env.NODE_ENV === "test") {
    const index = mockAnnouncementData.findIndex((announcement) => announcement.id === Number(id));
    if (index === -1) return false;
    mockAnnouncementData.splice(index, 1);
    return true;
  }
  return supabase.from(TABLE).delete().eq("id", id).select("id").maybeSingle()
    .then((result) => unwrap(result) !== null);
}
