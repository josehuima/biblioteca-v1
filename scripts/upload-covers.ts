import "dotenv/config";
import ImageKit from "imagekit";
import fetch from "node-fetch";
import { drizzle } from "drizzle-orm/neon-http";
import { books } from "../db/schema";
import { eq } from "drizzle-orm";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

const db = drizzle(process.env.DATABASE_URL!);

// Book covers from Open Library
const bookCovers: { [key: string]: string } = {
  "9780446310499": "to-kill-a-mockingbird", // To Kill a Mockingbird
  "9780451524935": "1984", // 1984
  "9780141439518": "pride-and-prejudice", // Pride and Prejudice
  "9780743273565": "the-great-gatsby", // The Great Gatsby
  "9780060883287": "one-hundred-years-of-solitude", // One Hundred Years of Solitude
  "9780316769488": "the-catcher-in-the-rye", // The Catcher in the Rye
  "9780399501487": "lord-of-the-flies", // Lord of the Flies
  "9780060850524": "brave-new-world", // Brave New World
  "9780547928227": "the-hobbit", // The Hobbit
  "9781451673319": "fahrenheit-451", // Fahrenheit 451
  "9780140268867": "the-odyssey", // The Odyssey
  "9780142437230": "don-quixote", // Don Quixote
  "9780141441146": "jane-eyre", // Jane Eyre
  "9780142437223": "the-divine-comedy", // The Divine Comedy
  "9780140449136": "crime-and-punishment", // Crime and Punishment
  "9780374528379": "the-brothers-karamazov", // The Brothers Karamazov
  "9781400079988": "war-and-peace", // War and Peace
  "9780141439570": "the-picture-of-dorian-gray", // The Picture of Dorian Gray
  "9780141439556": "wuthering-heights", // Wuthering Heights
  "9780140449266": "the-count-of-monte-cristo", // The Count of Monte Cristo
  "9780140444308": "les-miserables", // Les Misérables
  "9780143039433": "the-grapes-of-wrath", // The Grapes of Wrath
  "9780684801223": "the-old-man-and-the-sea", // The Old Man and the Sea
  "9780142437247": "moby-dick", // Moby-Dick
  "9780140424386": "the-canterbury-tales", // The Canterbury Tales
  "9780140424393": "paradise-lost", // Paradise Lost
  "9780142437261": "the-scarlet-letter", // The Scarlet Letter
  "9780141441672": "heart-of-darkness", // Heart of Darkness
  "9780142437179": "the-adventures-of-huckleberry-finn", // The Adventures of Huckleberry Finn
  "9780143035008": "anna-karenina", // Anna Karenina
};

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
    const startingPoint = "9780140444308"; // Les Misérables
    let shouldStart = false;

    for (const [isbn, fileName] of Object.entries(bookCovers)) {
      if (isbn === startingPoint) {
        shouldStart = true;
      }
      
      if (!shouldStart) {
        continue;
      }

      console.log(`Processing cover for ISBN ${isbn}...`);
      
      try {
        // Download and upload the cover
        const filePath = await downloadAndUploadCover(isbn, fileName);
        
        // Update the book record in the database
        await db.update(books)
          .set({ cover: filePath })
          .where(eq(books.isbn, isbn));
        
        console.log(`Successfully updated cover for ISBN ${isbn}`);
      } catch (error) {
        console.error(`Error processing cover for ISBN ${isbn}:`, error);
        // Continue with next book instead of exiting
        continue;
      }
    }
    
    console.log('All remaining covers have been processed!');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main(); 