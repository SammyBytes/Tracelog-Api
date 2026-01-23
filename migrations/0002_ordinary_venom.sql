ALTER TABLE `authors` RENAME COLUMN "email" TO "id";--> statement-breakpoint
ALTER TABLE `commits` RENAME COLUMN "author_email" TO "author_id";--> statement-breakpoint
ALTER TABLE `commits` ALTER COLUMN "author_id" TO "author_id" text REFERENCES authors(id) ON DELETE no action ON UPDATE no action;