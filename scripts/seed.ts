import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { books } from "../db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  try {
    // Clear existing data
    await db.delete(books);
    
    // Insert new books
    await db.insert(books).values([
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic Fiction', isbn: '9780446310499', totalCopies: 5, availableCopies: 5, cover: 'mockingbird.jpg' },
      { title: '1984', author: 'George Orwell', genre: 'Dystopian Fiction', isbn: '9780451524935', totalCopies: 5, availableCopies: 5, cover: '1984.jpg' },
      { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic Romance', isbn: '9780141439518', totalCopies: 5, availableCopies: 5, cover: 'pride.jpg' },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Fiction', isbn: '9780743273565', totalCopies: 5, availableCopies: 5, cover: 'gatsby.jpg' },
      { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', genre: 'Magical Realism', isbn: '9780060883287', totalCopies: 5, availableCopies: 5, cover: 'solitude.jpg' },
      { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Coming-of-age Fiction', isbn: '9780316769488', totalCopies: 5, availableCopies: 5, cover: 'catcher.jpg' },
      { title: 'Lord of the Flies', author: 'William Golding', genre: 'Psychological Fiction', isbn: '9780399501487', totalCopies: 5, availableCopies: 5, cover: 'flies.jpg' },
      { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian Fiction', isbn: '9780060850524', totalCopies: 5, availableCopies: 5, cover: 'brave.jpg' },
      { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', isbn: '9780547928227', totalCopies: 5, availableCopies: 5, cover: 'hobbit.jpg' },
      { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Dystopian Fiction', isbn: '9781451673319', totalCopies: 5, availableCopies: 5, cover: 'fahrenheit.jpg' },
      { title: 'The Odyssey', author: 'Homer', genre: 'Epic Poetry', isbn: '9780140268867', totalCopies: 5, availableCopies: 5, cover: 'odyssey.jpg' },
      { title: 'Don Quixote', author: 'Miguel de Cervantes', genre: 'Classic Fiction', isbn: '9780142437230', totalCopies: 5, availableCopies: 5, cover: 'quixote.jpg' },
      { title: 'Jane Eyre', author: 'Charlotte Brontë', genre: 'Gothic Fiction', isbn: '9780141441146', totalCopies: 5, availableCopies: 5, cover: 'jane.jpg' },
      { title: 'The Divine Comedy', author: 'Dante Alighieri', genre: 'Epic Poetry', isbn: '9780142437223', totalCopies: 5, availableCopies: 5, cover: 'divine.jpg' },
      { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Psychological Fiction', isbn: '9780140449136', totalCopies: 5, availableCopies: 5, cover: 'crime.jpg' },
      { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', genre: 'Philosophical Fiction', isbn: '9780374528379', totalCopies: 5, availableCopies: 5, cover: 'brothers.jpg' },
      { title: 'War and Peace', author: 'Leo Tolstoy', genre: 'Historical Fiction', isbn: '9781400079988', totalCopies: 5, availableCopies: 5, cover: 'war.jpg' },
      { title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', genre: 'Gothic Fiction', isbn: '9780141439570', totalCopies: 5, availableCopies: 5, cover: 'dorian.jpg' },
      { title: 'Wuthering Heights', author: 'Emily Brontë', genre: 'Gothic Fiction', isbn: '9780141439556', totalCopies: 5, availableCopies: 5, cover: 'wuthering.jpg' },
      { title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', genre: 'Adventure Fiction', isbn: '9780140449266', totalCopies: 5, availableCopies: 5, cover: 'monte.jpg' },
      { title: 'Les Misérables', author: 'Victor Hugo', genre: 'Historical Fiction', isbn: '9780140444308', totalCopies: 5, availableCopies: 5, cover: 'miserables.jpg' },
      { title: 'The Grapes of Wrath', author: 'John Steinbeck', genre: 'Historical Fiction', isbn: '9780143039433', totalCopies: 5, availableCopies: 5, cover: 'grapes.jpg' },
      { title: 'The Old Man and the Sea', author: 'Ernest Hemingway', genre: 'Literary Fiction', isbn: '9780684801223', totalCopies: 5, availableCopies: 5, cover: 'oldman.jpg' },
      { title: 'Moby-Dick', author: 'Herman Melville', genre: 'Adventure Fiction', isbn: '9780142437247', totalCopies: 5, availableCopies: 5, cover: 'moby.jpg' },
      { title: 'The Canterbury Tales', author: 'Geoffrey Chaucer', genre: 'Poetry', isbn: '9780140424386', totalCopies: 5, availableCopies: 5, cover: 'canterbury.jpg' },
      { title: 'Paradise Lost', author: 'John Milton', genre: 'Epic Poetry', isbn: '9780140424393', totalCopies: 5, availableCopies: 5, cover: 'paradise.jpg' },
      { title: 'The Scarlet Letter', author: 'Nathaniel Hawthorne', genre: 'Historical Fiction', isbn: '9780142437261', totalCopies: 5, availableCopies: 5, cover: 'scarlet.jpg' },
      { title: 'Heart of Darkness', author: 'Joseph Conrad', genre: 'Psychological Fiction', isbn: '9780141441672', totalCopies: 5, availableCopies: 5, cover: 'heart.jpg' },
      { title: 'The Adventures of Huckleberry Finn', author: 'Mark Twain', genre: 'Adventure Fiction', isbn: '9780142437179', totalCopies: 5, availableCopies: 5, cover: 'huck.jpg' },
      { title: 'Anna Karenina', author: 'Leo Tolstoy', genre: 'Tragic Romance', isbn: '9780143035008', totalCopies: 5, availableCopies: 5, cover: 'anna.jpg' }
    ]);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main(); 