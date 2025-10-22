
import { Metadata } from "next";
import { useAuth } from "@clerk/nextjs";
import { readTransactions } from "@/db/crud/transactions.crud";
import { readBooks } from "@/db/crud/books.crud";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auth } from '@clerk/nextjs/server'
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Minha biblioteca | Sistema de gestão de biblioteca",
  description: "Ver os livros que estás a ler",
};

export default async function BorrowingsPage() {


  const { userId } = await auth()
  

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // Get all transactions
  const transactions = await readTransactions();
  if (!transactions) {
    return <div>Nenhuma transação encontrada</div>;
  }

  // Filter for current user's active borrowings
  const activeBorrowings = transactions.filter(
    tx => tx.userId === userId && tx.status === "borrowed"
  );

  // Get unique book IDs
  const bookIds = [...new Set(activeBorrowings.map(tx => tx.physicalBookId))];

  // Fetch book details
  const books = (
    await Promise.all(
      bookIds.map(async (id) => {
        const book = await readBooks(1, 1, "id", "asc", id.toString());
        return book.books[0]; // Pode retornar undefined
      })
    )
  ).filter(Boolean); // Remove valores undefined
  

  console.log('Livros: ', books)

  // Create lookup map
  const bookMap = new Map(books.map(book => [book.id, book]));

  // Enrich borrowings with book details
  const enrichedBorrowings = activeBorrowings.map(tx => {
    const book = bookMap.get(tx.physicalBookId);
    return {
      ...tx,
      bookFile: book?.fileUrl || "",
      bookTitle: book?.title || "Unknown Book",
      bookAuthor: book?.author || "Unknown Author",
    };
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-600">Minha estante</h1>
        <p className="text-sm text-gray-500 mt-1">
          Mostrando {enrichedBorrowings.length} de livros ativos
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Data emprestimo</TableHead>
              <TableHead>Data devolução</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrichedBorrowings.map((tx) => (
              <TableRow key={tx.tid}>
                <TableCell>{tx.tid}</TableCell>
                <TableCell>{tx.bookTitle}</TableCell>
                <TableCell>{tx.bookAuthor}</TableCell>
                <TableCell>{tx.borrowedDate}</TableCell>
                <TableCell>{tx.returnedDate || "Não devolvido"}</TableCell>
                
                <TableCell>
                  <Button className="bg-green-600" asChild>
                    <Link href={`/user/reader/${tx.physicalBookId}/${tx.bookFile}`}>
                      Ler livro
                    </Link>

                  </Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 