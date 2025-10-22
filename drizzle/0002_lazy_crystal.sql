CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"genre" varchar(100) NOT NULL,
	"total_copies" integer DEFAULT 0 NOT NULL,
	"available_copies" integer DEFAULT 0 NOT NULL,
	"cover" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "physical_books" (
	"pid" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"borrowed" boolean DEFAULT false NOT NULL,
	"return_date" date,
	"user_id" varchar(255),
	"curr_transaction_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"tid" serial PRIMARY KEY NOT NULL,
	"physical_book_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"admin_id" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"borrowed_date" date DEFAULT now() NOT NULL,
	"returned_date" date
);
