import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Todos livros',
};

export default function AllBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 