import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { verifyPending } from "../schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// Function to create a pending user
export const createVerifyPending = async (clerkId: string, email: string) => {
  try {
    const user: typeof verifyPending.$inferInsert = { clerkId, email };
    const res = await db.insert(verifyPending).values(user);

    console.log("createVerifyPending: ", res);
    return res;  // Returning the result of the insert operation
  } catch (error) {
    console.log("Something Went Wrong:", error);
    throw new Error("Failed to create verifyPending record");
  }
};

// Function to read all pending users
export const readVerifyPending = async () => {
  try {
    const data = await db.select().from(verifyPending);
    console.log("readVerifyPending: ", data);
    return data;  // Returning the fetched data
  } catch (error) {
    console.log("Something Went Wrong:", error);
    throw new Error("Failed to read verifyPending records");
  }
};

// Function to update a pending user's data
export const updateVerifyPending = async (clerkId: string, newClerkId: string, newEmail: string) => {
  try {
    const res = await db.update(verifyPending)
      .set({ clerkId: newClerkId, email: newEmail })
      .where(eq(verifyPending.clerkId, clerkId));

    console.log("updateVerifyPending: ", res);
    return res;  // Returning the result of the update operation
  } catch (error) {
    console.log("Something Went Wrong:", error);
    throw new Error("Failed to update verifyPending record");
  }
};

// Function to delete a pending user
export const deleteVerifyPending = async (clerkId: string) => {
  try {
    const res = await db.delete(verifyPending).where(eq(verifyPending.clerkId, clerkId));
    console.log("deleteVerifyPending: ", res);
    return res;  // Returning the result of the delete operation
  } catch (error) {
    console.log("Something Went Wrong:", error);
    throw new Error("Failed to delete verifyPending record");
  }
};

export const findVerifyPending = async (clerkId: string) => {
  try {
    const data = await db.select().from(verifyPending).where(eq(verifyPending.clerkId, clerkId));
    console.log("findVerifyPending: ", data);
    return data;  // Returning the fetched data
  } catch (error) {
    console.log("Something Went Wrong:", error);
    throw new Error("Failed to find verifyPending record");
  }
}
