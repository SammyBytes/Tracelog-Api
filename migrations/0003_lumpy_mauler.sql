CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`api_key_hash` text NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_api_key_hash_unique` ON `organizations` (`api_key_hash`);--> statement-breakpoint
ALTER TABLE `projects` ADD `org_id` text REFERENCES organizations(id);