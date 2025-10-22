// app/admin/allusers/server.tsx
"use server";

import { readUsers } from "@/db/crud/users.crud";
import { clerkClient } from "@clerk/nextjs/server";

export async function fetchUsers() {

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList();

  // Convert complex user objects into plain objects
  const simplifiedUsers = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses?.[0]?.emailAddress || "",
    role: user.publicMetadata?.role || "user",
    imageUrl: user.imageUrl || "",
  }));

  return simplifiedUsers;
}

export async function changeRole(userId: string, newRole: string) {
  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role: newRole },
  });
}

export const getUsersWithClerk = async () => {
  // Fetch the list of users from your database
  const usersList = await readUsers();

  // Enrich user data with Clerk information
  const enriched = await Promise.all(
    (usersList ?? []).map(async (item) => {
      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(item.clerkId); // Fetch the Clerk user based on the clerkId

        return {
          profile: clerkUser.imageUrl, // User's profile picture URL
          fullName: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(), // User's full name
          email: clerkUser.emailAddresses?.[0]?.emailAddress || "Unknown Email", // User's email address
          role: clerkUser.publicMetadata?.role ?? "User", // User's role from public metadata (default to "N/A" if not present)
        };
      } catch (err) {
        console.error("Clerk Fetch Error:", err);
        return {
          profile: null,
          fullName: "Desconhecido",
          email: "Desconhecido",
          role: "N/D",
        };
      }
    })
    );
  
    return enriched;
  }
