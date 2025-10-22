"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { readTransactions } from "@/db/crud/transactions.crud";
import { readSingleBook } from "@/db/crud/books.crud";
import { db } from "@/db";
import { physicalBooks } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function fetchUserTransactions() {
    try {
        const session = await auth();
        const userId = session.userId;
        if (!userId) {
            throw new Error("Unauthorized");
        }
        console.log("User ID:", userId);

        // Get current user's email
        const userData = await currentUser();
        const userMap = new Map();
        if (userData?.emailAddresses?.[0]?.emailAddress) {
            userMap.set(userId, userData.emailAddresses[0].emailAddress);
        } else {
            userMap.set(userId, "Unknown");
        }
        console.log("User Email:", userMap.get(userId));

        // Get all transactions
        const transactions = await readTransactions();
        if (!transactions) {
            console.log("No transactions found");
            return [];
        }
        console.log("All Transactions:", transactions);

        // Filter transactions for the current user
        const userTransactions = transactions.filter(tx => tx.userId === userId);
        console.log("User Transactions:", userTransactions);

        // Get unique physical book IDs
        const physicalBookIds = [...new Set(userTransactions.map(tx => tx.physicalBookId))];
        console.log("Physical Book IDs:", physicalBookIds);

        // Create a map to store physical book to book ID mapping
        const bookIdMap = new Map();

        // Fetch physical books and their associated book IDs
        await Promise.all(
            physicalBookIds.map(async (pid) => {
                try {
                    console.log("Fetching physical book:", pid);
                    const physicalBook = await db.select().from(physicalBooks).where(eq(physicalBooks.bookId, pid));
                    console.log("Physical book result:", physicalBook);
                    if (physicalBook && physicalBook.length > 0) {
                        bookIdMap.set(pid, physicalBook[0].bookId);
                        console.log(`Mapped physical book ${pid} to book ${physicalBook[0].bookId}`);
                    }
                } catch (error) {
                    console.error(`Error fetching physical book ${pid}:`, error);
                }
            })
        );

        console.log("Book ID Map:", Object.fromEntries(bookIdMap));

        // Fetch book details using the actual book IDs
        const bookMap = new Map();
        await Promise.all(
            Array.from(bookIdMap.values()).map(async (bookId) => {
                try {
                    console.log("Fetching book:", bookId);
                    const book = await readSingleBook(bookId);
                    console.log("Book result:", book);
                    if (book) {
                        bookMap.set(bookId, book);
                        console.log(`Added book ${bookId} to book map:`, book);
                    }
                } catch (error) {
                    console.error(`Error fetching book ${bookId}:`, error);
                }
            })
        );

        console.log("Book Map:", Object.fromEntries(bookMap));

        // Enrich transactions with book and user details
        const enrichedTransactions = userTransactions.map(tx => {
            const bookId = bookIdMap.get(tx.physicalBookId);
            console.log(`Looking up book ID ${bookId} for physical book ${tx.physicalBookId}`);
            const book = bookId ? bookMap.get(bookId) : null;
            console.log(`Found book for transaction ${tx.tid}:`, book);
            return {
                ...tx,
                bookTitle: book?.title || "Unknown Book",
                bookAuthor: book?.author || "Unknown Author",
                userEmail: userMap.get(tx.userId) || "Unknown",
                adminEmail: "Unknown" // We'll handle admin emails separately if needed
            };
        });

        console.log("Enriched Transactions:", enrichedTransactions);
        return enrichedTransactions;
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        return [];
    }
} 