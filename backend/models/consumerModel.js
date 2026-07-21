let temporaryReadings = [
  { id: 'read-102', profile_id: 2, reading_date: '2026-07-01', previous_reading: 115.5, present_reading: 138.2, consumption: 22.7 },
  { id: 'read-101', profile_id: 2, reading_date: '2026-06-01', previous_reading: 93.4, present_reading: 115.5, consumption: 22.1 }
];

let temporaryInvoices = [
  { id: 2026006, profile_id: 2, total_bill: 450, remaining_balance: 450, status: 'Unpaid', billing_date: '2026-07-01', due_date: '2026-07-25' },
  { id: 2026005, profile_id: 2, total_bill: 390, remaining_balance: 0, status: 'Paid', billing_date: '2026-06-01', due_date: '2026-06-25' }
];

export const consumerModel = {
  findReadings: async (profileId, sessionUserId) => {
    if (profileId !== sessionUserId) {
      throw new Error('SQL permission violation: Cross-account dataset reading blocked.');
    }
    return temporaryReadings.filter(r => r.profile_id === profileId);
  },

  findInvoices: async (profileId, sessionUserId) => {
    if (profileId !== sessionUserId) {
      throw new Error('SQL permission violation: Cross-account dataset reading blocked.');
    }
    return temporaryInvoices.filter(i => i.profile_id === profileId);
  },

  executeWrite: async (sessionRole) => {
    if (sessionRole === 'consumer') {
      throw new Error('SQL permission violation: Table security configuration rejects all write attempts.');
    }
    return { success: true };
  }
};
