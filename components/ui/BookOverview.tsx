"use client";

import { IKImage, ImageKitProvider } from "imagekitio-next";
import React from "react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;

const BookOverview = ({
  title,
  author,
  genre,
  totalCopies,
  availableCopies,
  cover,
  isbn,
  onBorrow,
  onReturn, // New prop for return functionality
  borrowed,
  requested,
  maxBorrowed,
  loading,
  transaction,
}: {
  title: string;
  author: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  cover: string;
  isbn: string;
  onBorrow: () => void;
  onReturn: () => void; // New prop for return functionality
  borrowed: boolean;
  requested: boolean;
  maxBorrowed: boolean;
  loading: boolean;
  transaction: any;
}) => {
  const getButtonText = () => {
    if (loading) return "Processando...";
    if (transaction?.status === "RETURN") return "Return Requested";
    if (borrowed) return "Devolver";
    if (requested) return "Pedido pendente";
    if (maxBorrowed) return "Máx de livros emprestados";
    return "+ Leitura";
  };

  const isDisabled = loading || transaction?.status === "RETURN" || (!borrowed && !requested && !maxBorrowed);

  return (
    <section className="flex flex-col-reverse text-green-600 items-center justify-around gap-12 sm:gap-32 xl:flex-row xl:gap-8 mx-10 my-10 w-full max-w-7xl">
      {/* Left side: Book Info */}
      <div className="flex flex-col gap-5 max-w-[600px] min-w-[300px] w-full">
        <h1 className="text-5xl font-semibold text-black dark:text-white md:text-7xl">{title}</h1>

        <p className="text-xl text-light-100">
          Autor <span className="font-semibold text-[#EED1AC]">{author}</span>
        </p>

        <div className="mt-4 flex flex-col gap-3">
          <p className="text-xl text-light-100">
            ISBN: <span className="font-semibold text-[#EED1AC]">{isbn}</span>
          </p>

          <p className="text-xl text-light-100">
            Categoria: <span className="font-semibold text-[#EED1AC]">{genre}</span>
          </p>

          <div className="flex flex-row text-green-600 flex-wrap gap-4 mt-2">
            <p className="text-xl  text-light-100">
              Total: <span className="font-semibold text-[#EED1AC]">{totalCopies}</span>
            </p>

            <p className="text-xl text-light-100">
              Disponiveis: <span className="font-semibold text-[#EED1AC]">{availableCopies}</span>
            </p>
          </div>
        </div>

        {/* Borrow/Return Button */}
        <button
          onClick={transaction?.status === "RETURN" ? undefined : borrowed ? onReturn : onBorrow}
          disabled={isDisabled}
          className="mt-6 w-[200px] px-6 py-3 bg-green-600 text-white rounded-xl text-lg hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {getButtonText()}
        </button>
      </div>

      {/* Right side: Book Cover */}
      <div className="relative flex justify-center max-w-[400px] w-full">
        <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint}>
          <IKImage path={cover} alt="Book" width={300} height={400} />
        </ImageKitProvider>
      </div>
    </section>
  );
};

export default BookOverview;
