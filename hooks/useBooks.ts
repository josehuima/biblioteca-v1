import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  cover: string;
  isbn: string;
  fileUrl: string;
}

type SortField = "title" | "author" | "isbn" | "availableCopies" | "totalCopies";
type SortOrder = "asc" | "desc";

export function useBooks(basePath: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams?.get("page") || "1"));
  const [sortField, setSortField] = useState<SortField>((searchParams?.get("sort") as SortField) || "title");
  const [sortOrder, setSortOrder] = useState<SortOrder>((searchParams?.get("order") as SortOrder) || "asc");
  const pageSize = 10;

  useEffect(() => {
    fetchBooks();
  }, [currentPage, sortField, sortOrder, searchQuery]);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        sort: sortField,
        order: sortOrder,
        search: searchQuery
      });
      const response = await fetch(`/api/books?${params}`);
      const data = await response.json();
      setBooks(data.books || []);
      setTotalBooks(data.total || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    updateUrl(1, sortField, sortOrder, value);
  };

  const updateUrl = (page: number, sort: string, order: string, search: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (sort !== "title") params.set("sort", sort);
    if (order !== "asc") params.set("order", order);
    if (search) params.set("search", search);
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const totalPages = Math.ceil(totalBooks / pageSize);

  return {
    books,
    loading,
    searchQuery,
    currentPage,
    sortField,
    sortOrder,
    totalPages,
    handleSort,
    handleSearch,
    updateUrl,
    setCurrentPage
  };
} 