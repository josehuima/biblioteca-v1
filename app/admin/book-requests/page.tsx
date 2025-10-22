import { fetchTransactions, acceptTransaction, rejectTransaction } from "./server";
import TransactionsTable from "@/components/ui/TransactionsTable";
import { useAuth } from "@clerk/nextjs";
import { Metadata } from "next";
import { toast } from "sonner";

export const metadata: Metadata = {
  title: "Todas as transações | ISPI",
  description: "View and manage all transactions in the library",
};

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: any) {
  const page = searchParams?.page;
  const currentPage = typeof page === "string" ? Number(page) : 1;
  const pageSize = 10;

  const transactions = await fetchTransactions();
  const totalTransactions = transactions?.length ?? 0;
  const totalPages = Math.ceil(totalTransactions / pageSize);

  const paginatedTransactions = transactions?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ?? [];

  return <TransactionsTable initialTransactions={paginatedTransactions} totalPages={totalPages} totalTransactions={totalTransactions} currentPage={currentPage} />;
}
