ALTER TABLE "users" DROP CONSTRAINT "users_universityId_unique";--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "borrowed_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "isbn" varchar(13) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "universityId";--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_isbn_unique" UNIQUE("isbn");