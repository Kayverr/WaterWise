import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";

import {
  getMeterReadings,
  getMeterReading,
  createMeterReading,
  updateMeterReading,
  deleteMeterReading,
} from "../controllers/meterReading.controller.js";

import {
  fetchMeterReadings,
  fetchMeterReadingById,
  addMeterReading,
  editMeterReading,
  removeMeterReading,
} from "../services/meterReading.service.js";

vi.mock(
  "../services/meterReading.service.js",
  () => ({
    fetchMeterReadings: vi.fn(),
    fetchMeterReadingById: vi.fn(),
    addMeterReading: vi.fn(),
    editMeterReading: vi.fn(),
    removeMeterReading: vi.fn(),
  })
);

describe(
  "Meter Reading Controller",
  () => {
    let req;
    let res;

    beforeEach(() => {
      vi.clearAllMocks();

      req = {
        params: {},
        body: {},
      };

      res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
    });

    describe(
      "getMeterReadings",
      () => {
        it(
          "should return all meter readings",
          async () => {
            // Arrange

            const readings = [
              {
                id: 1,
                consumerName:
                  "Juan",
              },
            ];

            fetchMeterReadings.mockReturnValue(
              readings
            );

            // Act

            await getMeterReadings(
              req,
              res
            );

            // Assert

            expect(
              fetchMeterReadings
            ).toHaveBeenCalled();

            expect(
              res.status
            ).toHaveBeenCalledWith(
              200
            );

            expect(
              res.json
            ).toHaveBeenCalledWith(
              readings
            );
          }
        );

        it(
          "should return 500 when service throws",
          async () => {
            // Arrange

            fetchMeterReadings.mockImplementation(
              () => {
                throw new Error(
                  "Server Error"
                );
              }
            );

            // Act

            await getMeterReadings(
              req,
              res
            );

            // Assert

            expect(
              res.status
            ).toHaveBeenCalledWith(
              500
            );

            expect(
              res.json
            ).toHaveBeenCalledWith({
              message:
                "Server Error",
            });
          }
        );
      }
    );

    describe(
      "getMeterReading",
      () => {
        it(
          "should return a meter reading",
          async () => {
            // Arrange

            req.params.id = 1;

            const reading = {
              id: 1,
              consumerName:
                "Juan",
            };

            fetchMeterReadingById.mockReturnValue(
              reading
            );

            // Act

            await getMeterReading(
              req,
              res
            );

            // Assert

            expect(
              res.status
            ).toHaveBeenCalledWith(
              200
            );

            expect(
              res.json
            ).toHaveBeenCalledWith(
              reading
            );
          }
        );

        it(
          "should return 404 when record is not found",
          async () => {
            // Arrange

            req.params.id = 99;

            fetchMeterReadingById.mockImplementation(
              () => {
                throw new Error(
                  "Meter reading not found."
                );
              }
            );

            // Act

            await getMeterReading(
              req,
              res
            );

            // Assert

            expect(
              res.status
            ).toHaveBeenCalledWith(
              404
            );

            expect(
              res.json
            ).toHaveBeenCalledWith({
              message:
                "Meter reading not found.",
            });
          }
        );
      }
    );

    describe(
      "createMeterReading",
      () => {
        it(
          "should create a meter reading",
          async () => {
            // Arrange

            req.body = {
              consumerNo:
                "C-1001",
            };

            addMeterReading.mockReturnValue(
              {
                id: 1,
                ...req.body,
              }
            );

            // Act

            await createMeterReading(
              req,
              res
            );

            // Assert

            expect(
              addMeterReading
            ).toHaveBeenCalledWith(
              req.body
            );

            expect(
              res.status
            ).toHaveBeenCalledWith(
              201
            );

            expect(
              res.json
            ).toHaveBeenCalledWith({
              message:
                "Meter reading created successfully.",
              data: {
                id: 1,
                ...req.body,
              },
            });
          }
        );

        it(
          "should return validation errors",
          async () => {
            // Arrange

            addMeterReading.mockImplementation(
              () => {
                throw {
                  status: 400,
                  errors: {
                    consumerNo:
                      "Required",
                  },
                };
              }
            );

            // Act

            await createMeterReading(
              req,
              res
            );

            // Assert

            expect(
              res.status
            ).toHaveBeenCalledWith(
              400
            );

            expect(
              res.json
            ).toHaveBeenCalledWith({
              message:
                "Validation failed.",
              errors: {
                consumerNo:
                  "Required",
              },
            });
          }
        );
      }
    );

    describe(
      "updateMeterReading",
      () => {
        it(
          "should update a meter reading",
          async () => {
            // Arrange

            req.params.id = 1;

            req.body = {
              consumerName:
                "Updated",
            };

            editMeterReading.mockReturnValue(
              {
                id: 1,
                ...req.body,
              }
            );

            // Act

            await updateMeterReading(
              req,
              res
            );

            // Assert

            expect(
              editMeterReading
            ).toHaveBeenCalledWith(
              1,
              req.body
            );

            expect(
              res.status
            ).toHaveBeenCalledWith(
              200
            );

            expect(
              res.json
            ).toHaveBeenCalledWith({
              message:
                "Meter reading updated successfully.",
              data: {
                id: 1,
                ...req.body,
              },
            });
          }
        );

        it(
          "should return 404 when updating missing record",
          async () => {
            // Arrange

            editMeterReading.mockImplementation(
              () => {
                throw new Error(
                  "Meter reading not found."
                );
              }
            );

            // Act

            await updateMeterReading(
              req,
              res
            );

            // Assert

            expect(
              res.status
            ).toHaveBeenCalledWith(
              404
            );

            expect(
              res.json
            ).toHaveBeenCalledWith({
              message:
                "Meter reading not found.",
            });
          }
        );
      }
    );

    describe(
      "deleteMeterReading",
      () => {
        it(
          "should delete a meter reading",
          async () => {
            // Arrange

            req.params.id = 1;

            removeMeterReading.mockReturnValue(
              {
                message:
                  "Meter reading deleted successfully.",
              }
            );

            // Act

            await deleteMeterReading(
              req,
              res
            );

            // Assert

            expect(
              removeMeterReading
            ).toHaveBeenCalledWith(
              1
            );

            expect(
              res.status
            ).toHaveBeenCalledWith(
              200
            );

            expect(
              res.json
            ).toHaveBeenCalledWith({
              message:
                "Meter reading deleted successfully.",
            });
          }
        );

        it(
          "should return 404 when deleting missing record",
          async () => {
            // Arrange

            removeMeterReading.mockImplementation(
              () => {
                throw new Error(
                  "Meter reading not found."
                );
              }
            );

            // Act

            await deleteMeterReading(
              req,
              res
            );

            // Assert

            expect(
              res.status
            ).toHaveBeenCalledWith(
              404
            );

            expect(
              res.json
            ).toHaveBeenCalledWith({
              message:
                "Meter reading not found.",
            });
          }
        );
      }
    );
  }
);