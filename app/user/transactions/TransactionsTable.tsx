"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

interface Transaction {
    tid: number;
    userId: string;
    physicalBookId: number;
    adminId: string;
    status: string;
    borrowedDate: string;
    returnedDate: string | null;
    bookTitle: string;
    bookAuthor: string;
    userEmail: string;
    adminEmail: string;
}

interface TransactionsTableProps {
    initialTransactions: Transaction[];
    totalPages: number;
    totalTransactions: number;
    currentPage: number;
}

type SortField = "tid" | "bookTitle" | "status" | "borrowedDate" | "returnedDate" | "userEmail" | "adminEmail";
type SortOrder = "asc" | "desc";

export default function TransactionsTable({ initialTransactions, totalPages, totalTransactions, currentPage }: TransactionsTableProps) {
    const [sortField, setSortField] = useState<SortField>("tid");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [transactions, setTransactions] = useState(initialTransactions);
    const [filter, setFilter] = useState("all");

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === "all") return true;
        if (filter === "borrowed") return transaction.status === "borrowed";
        if (filter === "returned") return transaction.status === "returned";
        return true;
    });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
    });

    const SortButton = ({ field, label }: { field: SortField; label: string }) => (
        <Button variant="ghost" onClick={() => handleSort(field)} className="flex items-center gap-1">
            {label}
            {sortField === field && (sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
        </Button>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Minhas requisições</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Mostrando {(currentPage - 1) * 10 + 1} para {Math.min(currentPage * 10, totalTransactions)} de {totalTransactions} transactions
                    </p>
                </div>
                <div className="flex gap-4">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as requisições</SelectItem>
                            <SelectItem value="borrowed">Emprestado</SelectItem>
                            <SelectItem value="returned">Devolução</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSortField("tid");
                            setSortOrder("desc");
                        }}
                    >
                        Novos
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <SortButton field="tid" label="Transaction ID" />
                            </TableHead>
                            <TableHead>
                                <SortButton field="bookTitle" label="Book Title" />
                            </TableHead>
                            <TableHead>
                                <SortButton field="status" label="Status" />
                            </TableHead>
                            <TableHead>
                                <SortButton field="userEmail" label="User Email" />
                            </TableHead>
                            <TableHead>
                                <SortButton field="adminEmail" label="Admin Email" />
                            </TableHead>
                            <TableHead>
                                <SortButton field="borrowedDate" label="Borrowed Date" />
                            </TableHead>
                            <TableHead>
                                <SortButton field="returnedDate" label="Returned Date" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTransactions.map((tx) => (
                            <TableRow key={tx.tid}>
                                <TableCell>{tx.tid}</TableCell>
                                <TableCell>{tx.bookTitle}</TableCell>
                                <TableCell className="capitalize">{tx.status}</TableCell>
                                <TableCell>{tx.userEmail}</TableCell>
                                <TableCell>{tx.adminEmail}</TableCell>
                                <TableCell>{tx.borrowedDate}</TableCell>
                                <TableCell>{tx.returnedDate || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 