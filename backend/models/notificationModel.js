const e2eSeedAlerts = [
  {
    id: "2026001",
    profile_id: 2,
    category: "bill",
    title: "New meter reading",
    message: "Your June 2026 meter reading is now available.",
    is_read: false,
  },
  {
    id: "2026002",
    profile_id: 2,
    category: "announcement",
    title: "Distribution advisory",
    message: "Purok 3 maintenance window is scheduled for field validation.",
    is_read: false,
  },
  {
    id: "alert-id-purok-1",
    profile_id: 3,
    category: "announcement",
    title: "Main Pipeline Maintenance",
    message: "Temporary water service interruption.",
    is_read: false,
  },
];

const legacySeedAlerts = [
  {
    id: "valid-alert-101",
    profile_id: 2,
    category: "bill",
    title: "June Bill Overdue",
    message: "Your current volumetric balance due is 1,450.75.",
    is_read: false,
  },
];

const seedAlerts = process.env.WATERWISE_E2E === "true"
  ? e2eSeedAlerts
  : [...e2eSeedAlerts, ...legacySeedAlerts];

const cloneAlerts = (alerts) => alerts.map((alert) => ({ ...alert }));
let temporaryDatabaseAlerts = cloneAlerts(seedAlerts);

export const notificationModel = {
  findAll: async () => cloneAlerts(temporaryDatabaseAlerts),

  findById: async (id) =>
    temporaryDatabaseAlerts.find((item) => item.id === id) || null,

  updateReadStatus: async (id, isRead) => {
    const alert = temporaryDatabaseAlerts.find((item) => item.id === id);
    if (!alert) return null;

    alert.is_read = isRead;
    return { ...alert };
  },

  deleteById: async (id) => {
    const index = temporaryDatabaseAlerts.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const [deleted] = temporaryDatabaseAlerts.splice(index, 1);
    return { ...deleted };
  },

  __resetStorage: (newSeeds = seedAlerts) => {
    temporaryDatabaseAlerts = cloneAlerts(newSeeds);
  },
};
