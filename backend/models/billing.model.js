import mockBillingData from "../data/mockBillingData.js";

const consumerBillingData = [
  {
    id: 2026006,
    user_id: 2,
    billing_date: "2026-07-01",
    due_date: "2026-07-25",
    total_bill: 450,
    remaining_balance: 450,
    status: "Unpaid",
    consumption: {
      reading_date: "2026-07-01",
      previous_reading: 115.5,
      present_reading: 138.2,
      consumption: 22.7,
    },
  },
  {
    id: 2026005,
    user_id: 2,
    billing_date: "2026-06-01",
    due_date: "2026-06-25",
    total_bill: 390,
    remaining_balance: 0,
    status: "Paid",
    consumption: {
      reading_date: "2026-06-01",
      previous_reading: 93.4,
      present_reading: 115.5,
      consumption: 22.1,
    },
  },
  {
    id: 2026004,
    user_id: 2,
    billing_date: "2026-05-01",
    due_date: "2026-05-25",
    total_bill: 360,
    remaining_balance: 0,
    status: "Paid",
    consumption: {
      reading_date: "2026-05-01",
      previous_reading: 72.9,
      present_reading: 93.4,
      consumption: 20.5,
    },
  },
];

export function fetchBillingRecords(userId) {
  if (userId === undefined) {
    return mockBillingData;
  }

  return [...consumerBillingData, ...mockBillingData].filter(
    (record) => record.user_id === Number(userId)
  );
}

export function fetchBillingRecordById(id) {
  return [...consumerBillingData, ...mockBillingData].find(
    (record) => record.id === Number(id)
  );
}

export function fetchBillingRecordByUserId(userId) {
  return [...consumerBillingData, ...mockBillingData].find(
    (record) =>
      record.user_id === Number(userId)
  );
}

export function insertBillingRecord(billingRecord) {
  const nextId =
    mockBillingData.length > 0
      ? Math.max(
          ...mockBillingData.map(
            (record) => record.id
          )
        ) + 1
      : 1;

  const newRecord = {
    id: nextId,
    ...billingRecord,
  };

  mockBillingData.push(newRecord);

  return newRecord;
}

export function updateBillingRecord(
  id,
  updatedFields
) {
  const billingRecord =
    fetchBillingRecordById(id);

  if (!billingRecord) {
    return null;
  }

  Object.assign(
    billingRecord,
    updatedFields
  );

  return billingRecord;
}

export function removeBillingRecord(id) {
  const index =
    mockBillingData.findIndex(
      (record) =>
        record.id === Number(id)
    );

  if (index === -1) {
    return false;
  }

  mockBillingData.splice(index, 1);

  return true;
}
