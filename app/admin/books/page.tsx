"use client";

import { Suspense } from "react";
import { BookTableWithParams } from "./BookTableWithParams";

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando..</div>}>
      <BookTableWithParams />
    </Suspense>
  );
}
