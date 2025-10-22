import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { systemMetadata } from "../schema";

const db = drizzle(process.env.DATABASE_URL!);

export const readSystemMetadata = async () => {
  try {
    const res = await db.select().from(systemMetadata);
    console.log("readSystemMetadata:", res);

    return res;
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};

export const updateSystemMetadata = async (maxBooks: number, maxDays: number) => {
  try {
    const res = await db.update(systemMetadata).set({ maxBooks, maxDays });
    console.log("updateUsers:", res);
  } catch (error) {
    console.log("Something Went Wrong :", error);
  }
};
