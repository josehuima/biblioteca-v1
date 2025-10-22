import { readBooks } from "@/db/crud/books.crud";
import BooksTableWrapper from "@/components/ui/BooksTableWrapper";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: any) {
  // Ensure searchParams is properly handled
  const { page } = await Promise.resolve(searchParams || {});
  const currentPage = typeof page === "string" ? Number(page) : 1;
  const pageSize = 10;

  const { books, totalPages, totalBooks } = await readBooks(currentPage, pageSize);

  return <BooksTableWrapper initialBooks={books} totalPages={totalPages} totalBooks={totalBooks} currentPage={currentPage} />;
}
