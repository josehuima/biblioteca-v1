import { describe, it, expect, vi, beforeEach } from "vitest";
import * as transactionsServer from "@/app/admin/book-requests/server";
import * as transactionsCrud from "@/db/crud/transactions.crud";

// Mock the db module and the required methods
vi.mock("@/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ tid: 1, physicalBookId: 42 }]), // Mock the returned value
        }),
      }),
    }),
  },
}));

// Mock the CRUD functions explicitly
vi.mock("@/db/crud/transactions.crud", () => ({
  updateTransactions: vi.fn(),
  updateTransactionsSuccess: vi.fn(),
  readTransactions: vi.fn(),
}));

describe("Transaction server functions", () => {
  let mockUpdate: ReturnType<typeof vi.spyOn>;
  let mockRead: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdate = vi.spyOn(transactionsCrud, "updateTransactions");
    mockRead = vi.spyOn(transactionsCrud, "readTransactions");
  });

  describe("acceptTransaction", () => {
    it('should call updateTransactions with "accepted" status', async () => {
      mockUpdate.mockResolvedValueOnce({});

      const validUserId = "user123";
      const result = await transactionsServer.acceptTransaction(1, validUserId);

      expect(mockUpdate).toHaveBeenCalledWith(1, "accepted", "user123");
      expect(result).toEqual({
        success: true,
        message: "Transaction accepted successfully",
      });
    });

    it("should throw if userId is null or undefined", async () => {
      await expect(transactionsServer.acceptTransaction(1, null)).rejects.toThrow("Unauthorized");
      await expect(transactionsServer.acceptTransaction(1, undefined)).rejects.toThrow("Unauthorized");
    });
  });

  describe("rejectTransaction", () => {
    it('should call updateTransactions with "rejected" status', async () => {
      mockUpdate.mockResolvedValueOnce({});

      const validUserId = "admin123";
      const result = await transactionsServer.rejectTransaction(2, validUserId);

      expect(mockUpdate).toHaveBeenCalledWith(2, "rejected", validUserId);
      expect(result).toEqual({
        success: true,
        message: "Transaction rejected successfully",
      });
    });

    it("should throw if userId is null or undefined", async () => {
      await expect(transactionsServer.rejectTransaction(2, null)).rejects.toThrow("Unauthorized");
      await expect(transactionsServer.rejectTransaction(2, undefined)).rejects.toThrow("Unauthorized");
    });
  });

  describe("fetchTransactions", () => {
    it("should return transactions from the database", async () => {
      const fakeData = [{ tid: 1, status: "pending" }];
      mockRead.mockResolvedValueOnce(fakeData);

      const result = await transactionsServer.fetchTransactions();

      expect(mockRead).toHaveBeenCalled();
      expect(result).toEqual(fakeData);
    });
  });
});
