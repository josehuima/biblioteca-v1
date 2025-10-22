import { describe, it, expect, vi, beforeEach } from "vitest";
import * as borrowServer from "@/app/(root)/book/[id]/server"; // Adjust this path if needed
import * as transactionsCrud from "@/db/crud/transactions.crud";
import * as booksCrud from "@/db/crud/books.crud";
import * as physicalBooksCrud from "@/db/crud/physicalBooks.crud";

// Mock all necessary database operations
vi.mock("@/db/crud/transactions.crud", () => ({
  createTransactions: vi.fn(),
  getUserTransactionStatus: vi.fn(),
}));

vi.mock("@/db/crud/books.crud", () => ({
  readSingleBook: vi.fn(),
}));

vi.mock("@/db/crud/physicalBooks.crud", () => ({
  findOneAvailablePhysicalBookId: vi.fn(), // Fix: Correct the mock name
}));

describe("Borrow Book Server Functions", () => {
  const mockGetUserTransactionStatus = transactionsCrud.getUserTransactionStatus as unknown as ReturnType<typeof vi.fn>;
  const mockCreateTransactions = transactionsCrud.createTransactions as unknown as ReturnType<typeof vi.fn>;
  const mockReadSingleBook = booksCrud.readSingleBook as unknown as ReturnType<typeof vi.fn>;
  const mockFindAvailablePhysicalBookId = physicalBooksCrud.findOneAvailablePhysicalBookId as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handleBorrowBook", () => {
    it("should not allow borrowing if the user already borrowed the book", async () => {
      mockGetUserTransactionStatus.mockResolvedValueOnce({ borrowed: true, requested: false });

      const result = await borrowServer.handleBorrowBook(1, "user123");

      expect(result).toEqual({ success: false, message: "You have already borrowed this book." });
    });

    it("should not allow borrowing if the user has already requested the book", async () => {
      mockGetUserTransactionStatus.mockResolvedValueOnce({ borrowed: false, requested: true });

      const result = await borrowServer.handleBorrowBook(1, "user123");

      expect(result).toEqual({ success: false, message: "You have already requested this book." });
    });

    it("should allow borrowing if the book is available", async () => {
      mockGetUserTransactionStatus.mockResolvedValueOnce({ borrowed: false, requested: false });
      mockFindAvailablePhysicalBookId.mockResolvedValueOnce(1); // Fix: Simulate a successful available book
      mockCreateTransactions.mockResolvedValueOnce({});

      const result = await borrowServer.handleBorrowBook(1, "user123");

      expect(mockCreateTransactions).toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: "Borrow request sent successfully!" });
    });

    it("should return an error if the book is unavailable", async () => {
      mockGetUserTransactionStatus.mockResolvedValueOnce({ borrowed: false, requested: false });
      mockFindAvailablePhysicalBookId.mockResolvedValueOnce(null); // No available book

      const result = await borrowServer.handleBorrowBook(1, "user123");

      expect(result).toEqual({ success: false, message: "Book is unavailable." });
    });
  });

  describe("fetchBookDetails", () => {
    it("should return book details if found", async () => {
      const fakeBook = { id: 1, title: "Test Book", author: "Author Name" };
      mockReadSingleBook.mockResolvedValueOnce(fakeBook);

      const result = await borrowServer.fetchBookDetails(1);

      expect(result).toEqual(fakeBook);
    });

    it("should return null and log an error if fetching book fails", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockReadSingleBook.mockRejectedValueOnce(new Error("Database error"));

      const result = await borrowServer.fetchBookDetails(1);

      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching book details:", expect.any(Error));
      expect(result).toBeNull();

      consoleErrorSpy.mockRestore();
    });
  });
});
