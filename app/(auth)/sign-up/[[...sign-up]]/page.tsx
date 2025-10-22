import "/app/globals.css";
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Skeleton from "@/components/ui/authform-skeleton";

export default function Page() {
  return (
    <div className="">
      {/* Show Skeleton when Clerk is loading */}
      <ClerkLoading>
        <Skeleton type = "signup"/>
      </ClerkLoading>

      {/* Show SignIn UI after Clerk has loaded */}
      <ClerkLoaded>
        <SignUp />
      </ClerkLoaded>
    </div>
  );
}
