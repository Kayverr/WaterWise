import { useCallback, useEffect, useState } from "react";
import AnnouncementForm from "../components/AnnouncementForm";
import AnnouncementPage from "../components/AnnouncementPage";
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  updateAnnouncement,
} from "../services/announcementAPI";

export default function AnnouncementManagementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setAnnouncements(await fetchAnnouncements());
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? requestError.message ?? "Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchAnnouncements()
      .then((records) => {
        if (active) {
          setAnnouncements(records);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError?.response?.data?.message ?? requestError.message ?? "Unable to load announcements.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const intervalId = window.setInterval(() => {
      fetchAnnouncements().then((records) => {
        if (active) setAnnouncements(records);
      }).catch(() => {});
    }, 15000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const saveAnnouncement = async (announcement) => {
    try {
      setError("");
      setSuccess("");
      const saved = editing
        ? await updateAnnouncement(editing.id, announcement)
        : await createAnnouncement(announcement);
      setSuccess(editing ? "Announcement updated in the database." : "Announcement published to the database.");
      setEditing(null);
      await loadAnnouncements();
      return saved;
    } catch (requestError) {
      const validationErrors = requestError?.response?.data?.errors;
      setError(validationErrors ? Object.values(validationErrors).join(" ") : requestError?.response?.data?.message ?? requestError.message ?? "Unable to save announcement.");
      return false;
    }
  };

  const remove = async (id) => {
    try {
      setError("");
      await deleteAnnouncement(id);
      setSuccess("Announcement deleted from the database.");
      if (editing?.id === id) setEditing(null);
      await loadAnnouncements();
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? requestError.message ?? "Unable to delete announcement.");
    }
  };

  return (
    <main className="space-y-6">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Community communication</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Announcement Management</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Create, publish, review, and update announcements for system users.</p>
      </header>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700" role="status">{success}</div>}
      <AnnouncementForm key={editing?.id ?? "create"} initialData={editing} onCancel={() => setEditing(null)} onSubmit={saveAnnouncement} />
      {loading ? <div className="h-40 animate-pulse rounded-lg bg-slate-100" /> : <AnnouncementPage announcements={announcements} onDelete={remove} onEdit={setEditing} />}
    </main>
  );
}
