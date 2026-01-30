DROP INDEX `accounts_api_key_hash_unique`;--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `api_key_hash`;--> statement-breakpoint
ALTER TABLE `accounts` DROP COLUMN `api_key_salt`;--> statement-breakpoint
ALTER TABLE `projects` ADD `github_repo` text;--> statement-breakpoint
CREATE UNIQUE INDEX `projects_github_repo_unique` ON `projects` (`github_repo`);