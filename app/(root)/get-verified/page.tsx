import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { verifyPending } from "@/drizzle/schema";
// import mail from "@/lib/mail"; // optional for now

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

const db = drizzle(process.env.DATABASE_URL);

async function main(userId: string, email: string) {
  const user: typeof verifyPending.$inferInsert = {
    clerkId: userId,
    email: email,
  };

  try {
    await db.insert(verifyPending).values(user);

    const client = await clerkClient();

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        verificationStatus: "requested",
      },
    });

    console.log("New user created & metadata updated!");
    return "Done";
  } catch (error: unknown) {
    if (error instanceof Error && error.message.toLowerCase().includes("duplicate")) {
      return "already";
    }
    return "Error";
  }
}

const page = async () => {
  const { redirectToSignIn } = await auth();
  const user = await currentUser();

  if (!user) return redirectToSignIn();

  const { id, primaryEmailAddressId, emailAddresses } = user;

  let primaryEmail = emailAddresses[0].emailAddress;
  for (const e of emailAddresses) {
    if (e.id === primaryEmailAddressId) {
      primaryEmail = e.emailAddress;
      break;
    }
  }

  const requested = await main(id, primaryEmail);

  // Optional email
  // try {
  //   await mail(primaryEmail, `Hello ${primaryEmail}`);
  // } catch (mailError) {
  //   console.error("Error sending email:", mailError);
  // }

  return (
    <div className="flex w-full h-full justify-center items-center text-2xl font-semibold">
      {requested === "Done" || requested === "already" ? (
        <h1>Pedido enviado com sucesso!</h1>
      ) : (
        <h1>
          Aconteceu algo de errado <br />
          Tente mais tarde!
        </h1>
      )}
    </div>
  );
};

export default page;
