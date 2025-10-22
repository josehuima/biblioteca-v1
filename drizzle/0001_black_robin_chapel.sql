CREATE TABLE "admin" (
	"clerkId" varchar(255) PRIMARY KEY NOT NULL,
	"primaryEmail" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "systemMetadata" (
	"maxBooks" integer DEFAULT 4 NOT NULL,
	"maxDays" integer DEFAULT 15 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"clerkId" varchar(255) PRIMARY KEY NOT NULL,
	"primaryEmail" varchar(255) NOT NULL,
	"universityId" varchar(30) NOT NULL,
	CONSTRAINT "users_universityId_unique" UNIQUE("universityId")
);
