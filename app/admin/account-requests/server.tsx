"use server";

import { createUsers } from "@/db/crud/users.crud";
import { readVerifyPending, deleteVerifyPending } from "@/db/crud/verifyPending.crud"; // Import correct functions
import { clerkClient } from "@clerk/nextjs/server";

export const getVerifyPendingWithClerk = async () => {
    const verifyPendingList = await readVerifyPending();

    const enriched = await Promise.all(
      verifyPendingList.map(async (item) => {
        try {
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(item.clerkId);

            return {
                ...item,
                fullName: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
                imageUrl: clerkUser.imageUrl,
            };
        } catch (err) {
            console.error("Clerk Fetch Error:", err);
            return {
                ...item,
                fullName: "Unknown User",
                imageUrl: null,
            };
        }
      })
    );
  
    return enriched;
  };

  export async function acceptUser(clerkId: string, email: string) {
    await createUsers(clerkId, email, "");
    await deleteVerifyPending(clerkId);
    
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        verificationStatus: "accepted",
      },
    });
  
    return { success: true };
  }

  export async function rejectUser(clerkId: string) {
    await deleteVerifyPending(clerkId);

    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        verificationStatus: "undefined",
      },
    });

    return { success: true };
  }