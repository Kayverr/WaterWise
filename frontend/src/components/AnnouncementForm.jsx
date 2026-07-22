import { useState } from "react";

const emptyAnnouncement = {
  title: "",
  content: "",
  publicationDate: "",
  relatedEvent: "",
};

export default function AnnouncementForm({ onSubmit, initialData = null, onCancel }) {
  const [announcement, setAnnouncement] = useState(() => initialData ?? emptyAnnouncement);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setAnnouncement((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!onSubmit) {
      window.alert("Announcement Published!");
      return;
    }

    try {
      setSubmitting(true);
      const saved = await onSubmit(announcement);
      if (saved !== false && !initialData) setAnnouncement(emptyAnnouncement);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">{initialData ? "Update Announcement" : "Create Announcement"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Announcement Title" value={announcement.title} onChange={handleChange} className="w-full rounded border p-3" />
        <textarea name="content" placeholder="Announcement Content" value={announcement.content} onChange={handleChange} rows={5} className="w-full rounded border p-3" />
        <input aria-label="Publication Date" type="date" name="publicationDate" value={announcement.publicationDate} onChange={handleChange} className="w-full rounded border p-3" />
        <select name="relatedEvent" value={announcement.relatedEvent} onChange={handleChange} className="w-full rounded border p-3">
          <option value="">Select Related Event</option>
          <option value="Barangay Assembly">Barangay Assembly</option>
          <option value="Water System Maintenance">Water System Maintenance</option>
          <option value="Community Clean-up">Community Clean-up</option>
          <option value="General Announcement">General Announcement</option>
        </select>
        <div className="flex gap-3">
          <button disabled={submitting} type="submit" className="rounded bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-60">
            {submitting ? "Saving..." : initialData ? "Update Announcement" : "Publish Announcement"}
          </button>
          {initialData && <button type="button" onClick={onCancel} className="rounded bg-slate-100 px-6 py-3 font-bold text-slate-700">Cancel</button>}
        </div>
      </form>
    </div>
  );
}
