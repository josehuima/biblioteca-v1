import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { admin } from "../schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const createAdmin = async (clerkId: string, primaryEmail: string) => {
  const user: typeof admin.$inferInsert = {
    clerkId,
    primaryEmail,
  };

  try {
    const res = await db.insert(admin).values(user);
    console.log("createAdmin:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const readAdmin = async () => {
  try {
    const res = await db.select().from(admin);
    console.log("readAdmin:", res);

    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const updateAdmin = async (clerkId: string, newPrimaryEmail: string) => {
  try {
    const res = await db.update(admin).set({ primaryEmail: newPrimaryEmail }).where(eq(admin.clerkId, clerkId));
    console.log("updateAdmin:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const deleteAdmin = async (clerkId: string) => {
  try {
    const res = await db.delete(admin).where(eq(admin.clerkId, clerkId));
    console.log("deleteAdmin:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};
