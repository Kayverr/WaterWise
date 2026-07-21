import consumptionHistoryCollection from "../data/consumptionHistory.collection.js";

export async function findConsumptionHistory({ userId, year } = {}) {
  if (!Number.isInteger(userId) || userId < 1) {
    throw new TypeError("A valid authenticated user ID is required.");
  }

  return consumptionHistoryCollection
    .filter((record) => record.userId === userId)
    .filter((record) => year === undefined || record.year === year)
    .map((record) => ({ ...record, monthlyData: [...record.monthlyData] }));
}
