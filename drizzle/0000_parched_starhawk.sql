CREATE TABLE "verifyPending" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "verifyPending_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"clerkId" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "verifyPending_clerkId_unique" UNIQUE("clerkId"),
	CONSTRAINT "verifyPending_email_unique" UNIQUE("email")
);
