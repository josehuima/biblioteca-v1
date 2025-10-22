"use server";

import { updateBooks, deletePhysicalBook, createPhysicalBooks } from "@/db/crud/books.crud";

export async function removePhysicalBook(bookId: number, currentTotal: number, currentAvailable: number, pid: number) {
  try {
    await deletePhysicalBook(pid);
    await updateBooks(bookId, currentTotal - 1, currentAvailable - 1);
    return { success: true, totalCopies: currentTotal - 1, availableCopies: currentAvailable - 1 };
  } catch (error) {
    console.error("Erro ao remover o livro fisico:", error);
    return { success: false, error: "Ocorreuum erro ao eliminar o livro fisico" };
  }
}

export async function addPhysicalBook(bookId: number, currentTotal: number, currentAvailable: number) {
  try {
    // Create new physical book
    const newPhysicalBook = await createPhysicalBooks(bookId, false, null, "", 0);
    console.log("Novo livro fisico adicionado com sucesso:", newPhysicalBook); // Debug log
    
    if (!newPhysicalBook || !newPhysicalBook.pid) {
      throw new Error("Ocorreu um erro ao pegar o ID do livro fisico");
    }

    // Update the book's copy counts
    await updateBooks(bookId, currentTotal + 1, currentAvailable + 1);
    
    return { 
      success: true, 
      totalCopies: currentTotal + 1, 
      availableCopies: currentAvailable + 1,
      physicalBookId: newPhysicalBook.pid
    };
  } catch (error) {
    console.error("Error adding physical book:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add physical book" 
    };
  }
} 