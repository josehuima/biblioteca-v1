import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Account Requests',
};

export default function AccountRequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 