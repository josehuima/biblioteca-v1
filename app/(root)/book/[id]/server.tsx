"use server";

import { createTransactions, getUserTransactionStatus, returnTransaction } from "@/db/crud/transactions.crud";
import { readSingleBook } from "@/db/crud/books.crud";
import { findOneAvailablePhysicalBookId } from "@/db/crud/physicalBooks.crud";
import { getAcceptedTransaction } from "@/db/crud/transactions.crud";

export async function handleBorrowBook(bookId: number, userId: string) {
  try {
    // Check user transaction status
    const { borrowed, requested, totalBorrowed } = await getUserTransactionStatus(bookId, userId);

    if (borrowed) {
      return { success: false, message: "Este livro já se encontra na sua biblioteca." };
    }

    if (requested) {
      return { success: false, message: "Este livro já se encontra na lista de requisições." };
    }

    if (totalBorrowed >= 4) {
      return { success: false, message: "Apenas lhe é permitido ter 4 livros na sua biblioteca." };
    }

    // Find an available physical book ID
    const physicalBookId = await findOneAvailablePhysicalBookId(bookId);

    if (!physicalBookId) {
      return { success: false, message: "Livro indisponível." };
    }

    // Create a transaction for the borrow request
    await createTransactions(physicalBookId, userId, "", "REQUESTED", undefined, undefined);

    return {
      success: true,
      message: "Livro requisitado com sucesso!.",
    };
  } catch (error) {
    console.error("Error in handleBorrowBook:", error);
    return {
      success: false,
      message: "ocorreu um erro ao processar o seu pedido.",
    };
  }
}

export async function fetchBookDetails(bookId: number) {
  try {
    const book = await readSingleBook(bookId); // use the new readSingleBook
    return book;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

export async function checkUserBookStatus(bookId: number, userId: string) {
  try {
    const { borrowed, requested, totalBorrowed } = await getUserTransactionStatus(bookId, userId);

    console.log("User Transaction Status:", { borrowed, requested, totalBorrowed });
    return {
      success: true,
      borrowed,
      requested,
      maxBorrowed: totalBorrowed >= 4,
    };
  } catch (error) {
    console.error("Error checking user book status:", error);
    return {
      success: false,
      borrowed: false,
      requested: false,
      maxBorrowed: false,
    };
  }
}

export async function fetchAcceptedTransaction(bookId: number, userId: string) {
  try {
    const transaction = await getAcceptedTransaction(userId, bookId);
    return transaction ? { success: true, transaction } : { success: false, message: "No accepted transaction found." };
  } catch (error) {
    console.error("Error fetching accepted transaction:", error);
    return { success: false, message: "An error occurred while fetching the transaction." };
  }
}

export async function handleReturnBook(tid: number) {
  try {
    await returnTransaction(tid);
    return { success: true, message: "Return request submitted successfully!" };
  } catch (error) {
    console.error("Error in handleReturnBook:", error);
    return { success: false, message: "An error occurred while processing the return request." };
  }
}
