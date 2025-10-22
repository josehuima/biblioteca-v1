"use server";

import { readBooks } from "@/db/crud/books.crud";

export async function fetchBooks() {
  return await readBooks();
}