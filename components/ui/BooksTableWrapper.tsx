"use client";

import BooksTable from "./BooksTable";
import { ToastProvider } from "./ToastContext";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface BooksTableWrapperProps {
  initialBooks: any[];
  totalPages: number;
  totalBooks: number;
  currentPage: number;
}

export default function BooksTableWrapper(_props: BooksTableWrapperProps) {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const page = Number(searchParams?.get("page")) || 1;
    setCurrentPage(page);
    fetch(`/api/admin/books?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
        setTotalPages(data.totalPages);
        setTotalBooks(data.totalBooks);
      });
  }, [searchParams]);

  return (
    <ToastProvider>
      <BooksTable 
        initialBooks={books} 
        totalPages={totalPages} 
        totalBooks={totalBooks} 
        currentPage={currentPage} 
      />
    </ToastProvider>
  );
} 