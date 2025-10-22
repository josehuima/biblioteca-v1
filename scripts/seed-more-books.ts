import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { books } from "../db/schema";
import ImageKit from "imagekit";
import fetch from "node-fetch";

const db = drizzle(process.env.DATABASE_URL!);

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

// New contemporary books with ISBNs
const newBooks = [
  { title: "Project Hail Mary", author: "Andy Weir", genre: "Science Fiction", isbn: "9780593135204", cover: "project-hail-mary" },
  { title: "The Midnight Library", author: "Matt Haig", genre: "Contemporary Fiction", isbn: "9780525559474", cover: "midnight-library" },
  { title: "Klara and the Sun", author: "Kazuo Ishiguro", genre: "Literary Fiction", isbn: "9780571364879", cover: "klara-and-the-sun" },
  { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", genre: "Historical Fiction", isbn: "9781501161933", cover: "evelyn-hugo" },
  { title: "Atomic Habits", author: "James Clear", genre: "Self-Help", isbn: "9780735211292", cover: "atomic-habits" },
  { title: "Educated", author: "Tara Westover", genre: "Memoir", isbn: "9780399590504", cover: "educated" },
  { title: "The Silent Patient", author: "Alex Michaelides", genre: "Psychological Thriller", isbn: "9781250301697", cover: "silent-patient" },
  { title: "Where the Crawdads Sing", author: "Delia Owens", genre: "Literary Fiction", isbn: "9780735219090", cover: "crawdads" },
  { title: "The Thursday Murder Club", author: "Richard Osman", genre: "Mystery", isbn: "9780241425442", cover: "thursday-murder" },
  { title: "The Invisible Life of Addie LaRue", author: "V.E. Schwab", genre: "Fantasy", isbn: "9780765387561", cover: "addie-larue" },
  { title: "Mexican Gothic", author: "Silvia Moreno-Garcia", genre: "Horror", isbn: "9780525620785", cover: "mexican-gothic" },
  { title: "The House in the Cerulean Sea", author: "TJ Klune", genre: "Fantasy", isbn: "9781250217288", cover: "cerulean-sea" },
  { title: "A Gentleman in Moscow", author: "Amor Towles", genre: "Historical Fiction", isbn: "9780670026197", cover: "gentleman-moscow" },
  { title: "The Vanishing Half", author: "Brit Bennett", genre: "Literary Fiction", isbn: "9780525536291", cover: "vanishing-half" },
  { title: "Circe", author: "Madeline Miller", genre: "Fantasy", isbn: "9780316556347", cover: "circe" },
  { title: "The Song of Achilles", author: "Madeline Miller", genre: "Historical Fiction", isbn: "9780062060617", cover: "song-achilles" },
  { title: "Normal People", author: "Sally Rooney", genre: "Contemporary Fiction", isbn: "9781984822178", cover: "normal-people" },
  { title: "Hamnet", author: "Maggie O'Farrell", genre: "Historical Fiction", isbn: "9780525657606", cover: "hamnet" },
  { title: "The Lincoln Highway", author: "Amor Towles", genre: "Historical Fiction", isbn: "9780735222359", cover: "lincoln-highway" },
  { title: "Cloud Cuckoo Land", author: "Anthony Doerr", genre: "Literary Fiction", isbn: "9781982168438", cover: "cloud-cuckoo" },
  { title: "The Paris Apartment", author: "Lucy Foley", genre: "Mystery", isbn: "9780008385996", cover: "paris-apartment" },
  { title: "Book Lovers", author: "Emily Henry", genre: "Romance", isbn: "9780593440872", cover: "book-lovers" },
  { title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", genre: "Literary Fiction", isbn: "9780593321201", cover: "tomorrow-x3" },
  { title: "Lessons in Chemistry", author: "Bonnie Garmus", genre: "Historical Fiction", isbn: "9780385547345", cover: "lessons-chemistry" },
  { title: "The Diamond Eye", author: "Kate Quinn", genre: "Historical Fiction", isbn: "9780062943514", cover: "diamond-eye" },
  { title: "Sea of Tranquility", author: "Emily St. John Mandel", genre: "Science Fiction", isbn: "9780593321447", cover: "sea-tranquility" },
  { title: "The It Girl", author: "Ruth Ware", genre: "Thriller", isbn: "9781982155261", cover: "it-girl" },
  { title: "Horse", author: "Geraldine Brooks", genre: "Historical Fiction", isbn: "9780399562969", cover: "horse" },
  { title: "Trust", author: "Hernan Diaz", genre: "Literary Fiction", isbn: "9780593420317", cover: "trust" },
  { title: "Demon Copperhead", author: "Barbara Kingsolver", genre: "Literary Fiction", isbn: "9780063251922", cover: "demon-copperhead" }
];

async function downloadAndUploadCover(isbn: string, fileName: string): Promise<string> {
  try {
    // Download cover from Open Library
    const response = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
    if (!response.ok) throw new Error(`Failed to download cover for ISBN ${isbn}`);
    
    const buffer = await response.buffer();
    
    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: `${fileName}.jpg`,
      folder: "/book-covers"
    });
    
    return uploadResponse.filePath;
  } catch (error) {
    console.error(`Error processing cover for ISBN ${isbn}:`, error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting to add new books...');
    
    for (const book of newBooks) {
      console.log(`Processing book: ${book.title}`);
      
      try {
        // Download and upload the cover
        const filePath = await downloadAndUploadCover(book.isbn, book.cover);
        
        // Add the book to the database
        await db.insert(books).values({
          title: book.title,
          author: book.author,
          genre: book.genre,
          isbn: book.isbn,
          totalCopies: 5,
          availableCopies: 5,
          cover: filePath
        });
        
        console.log(`Successfully added book: ${book.title}`);
      } catch (error) {
        console.error(`Error processing book ${book.title}:`, error);
        // Continue with next book instead of exiting
        continue;
      }
    }
    
    console.log('All new books have been added successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main(); 