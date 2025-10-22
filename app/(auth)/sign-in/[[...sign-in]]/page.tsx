"use client";
import "/app/globals.css"; // Ensure correct path
import { SignIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Skeleton from "@/components/ui/authform-skeleton";

export default function Page() {
  return (
    <div className="">
      {/* Show Skeleton when Clerk is loading */}
      <ClerkLoading>
        <Skeleton type = "signin"/>
      </ClerkLoading>

      {/* Show SignIn UI after Clerk has loaded */}
      <ClerkLoaded>
        <SignIn />
      </ClerkLoaded>
    </div>
  );
}
