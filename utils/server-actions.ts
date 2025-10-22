"use server";

import { createBooks, fetchBookById, fetchLimitedBooks } from "@/db/crud/books.crud";
import { createPhysicalBooks } from "@/db/crud/physicalBooks.crud";

export async function createBookAction(isbn: string, title: string, author: string, genre: string, totalCopies: number, availableCopies: number, cover: string, documentType: number) {
  if (!title || !author || !genre || !isbn || !cover) {
    throw new Error("Missing required fields");
  }

  if (isNaN(totalCopies) || isNaN(availableCopies)) {
    throw new Error("Invalid number of copies");
  }

  if (availableCopies > totalCopies) {
    throw new Error("Available copies cannot be greater than total copies");
  }

  // Step 1: Create the book
  const res = await createBooks(isbn, title, author, genre, totalCopies, availableCopies, cover, documentType);

  if (!res) {
    throw new Error("Failed to create book");
  }

  // Step 2: Fetch the last inserted book
  const latestBooks = await fetchLimitedBooks(1); // fetching the most recent book
  const latestBook = latestBooks[0];

  if (!latestBook || !latestBook.id) {
    throw new Error("Failed to fetch the newly created book");
  }

  const bookId = latestBook.id;

  // Step 3: Create physical books
  const borrowed = false;
  const returnDate = null; // ✅ use null for DATE type
  const userId = "";
  const currTransactionId = 0;

  for (let i = 0; i < totalCopies; i++) {
    await createPhysicalBooks(bookId, borrowed, returnDate, userId, currTransactionId);
  }

  return { success: true };
}
