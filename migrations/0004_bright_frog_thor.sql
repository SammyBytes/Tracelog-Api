ALTER TABLE `organizations` RENAME TO `accounts`;--> statement-breakpoint
ALTER TABLE `projects` RENAME COLUMN "org_id" TO "account_id";--> statement-breakpoint
DROP INDEX `organizations_api_key_hash_unique`;--> statement-breakpoint
ALTER TABLE `accounts` ADD `type` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_api_key_hash_unique` ON `accounts` (`api_key_hash`);--> statement-breakpoint
ALTER TABLE `projects` ALTER COLUMN "account_id" TO "account_id" text REFERENCES accounts(id) ON DELETE no action ON UPDATE no action;