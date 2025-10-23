"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

type SortField = "title" | "author" | "isbn" | "availableCopies" | "totalCopies";
type SortOrder = "asc" | "desc";

export function BookTableWithParams() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") ?? "");
    const [loading, setLoading] = useState(true);
    const [totalBooks, setTotalBooks] = useState(0);
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams?.get("page") ?? "1"));
    const [sortField, setSortField] = useState<SortField>((searchParams?.get("sort") as SortField) ?? "title");
    const [sortOrder, setSortOrder] = useState<SortOrder>((searchParams?.get("order") as SortOrder) ?? "asc");
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
        router.push(`/admin/books${params.toString() ? `?${params.toString()}` : ""}`);
    };

    const totalPages = Math.ceil(totalBooks / pageSize);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Todos os livros</h1>
                <div className="relative w-64">
                    <Input
                        type="text"
                        placeholder="Procurar livros..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">Carregando livros...</div>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {/* Cabeçalhos de tabela com ordenação */}
                                {[
                                    { field: "title", label: "Titulo" },
                                    { field: "author", label: "Autor" },
                                    { field: "isbn", label: "ISBN" },
                                    { field: "availableCopies", label: "Cópias disponiveis" },
                                    { field: "totalCopies", label: "Total Copias" },
                                ].map(({ field, label }) => (
                                    <TableHead key={field} className="cursor-pointer" onClick={() => handleSort(field as SortField)}>
                                        <div className="flex items-center">
                                            {label}
                                            {sortField === field && (
                                                sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                                <TableHead>Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell className="font-medium">{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.isbn}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                            }`}>
                                            {book.availableCopies}
                                        </span>
                                    </TableCell>
                                    <TableCell>{book.totalCopies}</TableCell>
                                    <TableCell>
                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 p-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const newPage = Math.max(1, currentPage - 1);
                                    setCurrentPage(newPage);
                                    updateUrl(newPage, sortField, sortOrder, searchQuery);
                                }}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            <span className="text-sm">
                                Página {currentPage} de {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const newPage = Math.min(totalPages, currentPage + 1);
                                    setCurrentPage(newPage);
                                    updateUrl(newPage, sortField, sortOrder, searchQuery);
                                }}
                                disabled={currentPage === totalPages}
                            >
                                Seguinte
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
