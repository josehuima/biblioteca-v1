"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { BookCover } from "./BookCover";
import { formatISBN } from "@/utils/validation";
import { useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  cover: string;
  isbn: string;
}

export function BookTableRow({ book }: { book: Book }) {
  const router = useRouter();

  return (
    <TableRow 
      key={book.id} 
      className="cursor-pointer hover:bg-gray-100"
      onClick={() => router.push(`/book/${book.id}`)}
    >
      <TableCell>
        <BookCover cover={book.cover} title={book.title} />
      </TableCell>
      <TableCell>{book.title}</TableCell>
      <TableCell>{book.author}</TableCell>
      <TableCell>{book.genre}</TableCell>
      <TableCell>{formatISBN(book.isbn)}</TableCell>
      <TableCell>{book.totalCopies}</TableCell>
      <TableCell>{book.availableCopies}</TableCell>
    </TableRow>
  );
} 