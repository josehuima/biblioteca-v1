import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Todos usuários',
};

export default function AllUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 