import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { books, physicalBooks } from "../db/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  try {
    // Get all books from the database
    const allBooks = await db.select().from(books);
    
    for (const book of allBooks) {
      // Generate random number of copies between 4 and 7
      const numCopies = Math.floor(Math.random() * 4) + 4; // Random number between 4 and 7
      
      // Create physical copies for the book
      for (let i = 0; i < numCopies; i++) {
        await db.insert(physicalBooks).values({
          bookId: book.id,
          borrowed: false,
          returnDate: null,
          userId: "",
          currTransactionId: 0
        });
      }
      
      // Update the book's total and available copies
      await db.update(books)
        .set({
          totalCopies: numCopies,
          availableCopies: numCopies
        })
        .where(eq(books.id, book.id));
      
      console.log(`Added ${numCopies} physical copies for book: ${book.title}`);
    }
    
    console.log('Successfully added physical copies for all books');
  } catch (error) {
    console.error('Error adding physical copies:', error);
    process.exit(1);
  }
}

main(); 