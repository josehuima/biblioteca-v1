import { Suspense } from "react";
import BooksPageContent from "./BooksPageContent";

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando livros...</div>}>
      <BooksPageContent />
    </Suspense>
  );
}
