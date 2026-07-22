const sampleAnnouncements = [
  { id: 1, title: "Water Interruption Notice", content: "Water service will be temporarily unavailable due to maintenance.", publicationDate: "July 5, 2026", relatedEvent: "Water System Maintenance" },
  { id: 2, title: "Barangay Assembly Reminder", content: "Residents are encouraged to attend the upcoming assembly.", publicationDate: "July 8, 2026", relatedEvent: "Barangay Assembly" },
];

function displayDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

export default function AnnouncementPage({ announcements = sampleAnnouncements, onEdit, onDelete }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Announcements</h2>
      {announcements.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-slate-500">No announcements published yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <article key={announcement.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{announcement.title}</h3>
                  <p className="mt-2">{announcement.content}</p>
                  <p className="mt-2 text-sm text-gray-600"><strong>Publication Date:</strong> {displayDate(announcement.publicationDate)}</p>
                  <p className="text-sm text-gray-600"><strong>Related Event:</strong> {announcement.relatedEvent}</p>
                </div>
                {(onEdit || onDelete) && (
                  <div className="flex shrink-0 gap-2">
                    {onEdit && <button className="rounded bg-sky-50 px-3 py-2 text-sm font-bold text-sky-700" onClick={() => onEdit(announcement)} type="button">Edit</button>}
                    {onDelete && <button className="rounded bg-red-50 px-3 py-2 text-sm font-bold text-red-700" onClick={() => onDelete(announcement.id)} type="button">Delete</button>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
