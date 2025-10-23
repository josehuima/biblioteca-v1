"use client";

import { useState, useEffect } from "react";

import BookOverview from "@/components/ui/BookOverview";
import { handleBorrowBook, fetchBookDetails, checkUserBookStatus, fetchAcceptedTransaction, handleReturnBook } from "./server";

import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { BookOverviewSkeleton } from "@/components/ui/BookOverviewSkeleton";

interface BookDetails {
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  cover?: string | null;
  isbn: string;
}

interface Transaction {
  tid: string;
  status: "ACCEPTED" | "RETURN" | "PENDING";
  userId: string;
  bookId: string;
  createdAt?: string;
}


export default function Page() {
  const params = useParams();
  const bookId = params?.id as string;
  const router = useRouter();
  const { user, isLoaded } = useUser();




  

  const [borrowed, setBorrowed] = useState(false);
  const [requested, setRequested] = useState(false);
  const [maxBorrowed, setMaxBorrowed] = useState(false);
  const [loading, setLoading] = useState(false);
 const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
const [transaction, setTransaction] = useState<Transaction | null>(null);


  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const loadBook = async () => {
      const details = await fetchBookDetails(bookId);
      if (!details) {
        router.push("/404");
      } else {
        setBookDetails(details);
      }
    };
    loadBook();
  }, [bookId, router]);

  

  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        const status = await checkUserBookStatus(bookId, user.id);
        if (status.success) {
          setBorrowed(status.borrowed);
          setRequested(status.requested);
          setMaxBorrowed(status.maxBorrowed);
        }

        // Fetch accepted transaction
        const transactionResult = await fetchAcceptedTransaction(bookId, user.id);
        if (transactionResult.success) {
          setTransaction(transactionResult.transaction);
        }
      }
    };
    checkStatus();
  }, [user, bookId]);

  const handleBorrow = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    const result = await handleBorrowBook(bookId, user.id);
    setLoading(false);

    if (result.success) {
      setRequested(true);
    } else {
      console.error(result.message);
    }
  };

  const handleReturn = async () => {
    if (!transaction) return;

    setLoading(true);
    const result = await handleReturnBook(transaction.tid);
    setLoading(false);

    if (result.success) {
      setTransaction({ ...transaction, status: "RETURN" }); // Update transaction status in the UI
    } else {
      console.error(result.message);
    }
  };

  console.log('dados recebidos: ', bookDetails)

  if (!bookDetails) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <BookOverviewSkeleton />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center w-full">
      <section className="flex mx-4 my-4">
       
      </section>

      <BookOverview
        {...bookDetails}
        onBorrow={handleBorrow}
        onReturn={handleReturn} // Pass the return handler
        borrowed={borrowed}
        requested={requested}
        maxBorrowed={maxBorrowed}
        loading={loading}
        transaction={transaction} // Pass transaction details
      />


    </div>
  );
}
