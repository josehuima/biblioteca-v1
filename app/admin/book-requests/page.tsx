import { fetchTransactions } from "./server";
import TransactionsTable from "@/components/ui/TransactionsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Todas as transações | ISPI",
  description: "View and manage all transactions in the library",
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page;
  const currentPage = typeof page === "string" ? Number(page) : 1;
  const pageSize = 10;

  const transactions = await fetchTransactions();
  const totalTransactions = transactions?.length ?? 0;
  const totalPages = Math.ceil(totalTransactions / pageSize);

  const paginatedTransactions =
    transactions?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ?? [];

  return (
    <TransactionsTable
      initialTransactions={paginatedTransactions}
      totalPages={totalPages}
      totalTransactions={totalTransactions}
      currentPage={currentPage}
    />
  );
}
