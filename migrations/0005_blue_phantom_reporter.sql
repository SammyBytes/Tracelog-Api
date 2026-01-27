CREATE TABLE `oauth_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
DROP INDEX "accounts_email_unique";--> statement-breakpoint
DROP INDEX "accounts_api_key_hash_unique";--> statement-breakpoint
DROP INDEX "sessions_token_unique";--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "type" TO "type" text NOT NULL DEFAULT 'user';--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_api_key_hash_unique` ON `accounts` (`api_key_hash`);--> statement-breakpoint
ALTER TABLE `accounts` ALTER COLUMN "api_key_hash" TO "api_key_hash" text;--> statement-breakpoint
ALTER TABLE `accounts` ADD `email` text NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD `email_verified` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `accounts` ADD `image` text;--> statement-breakpoint
ALTER TABLE `accounts` ADD `updated_at` integer;