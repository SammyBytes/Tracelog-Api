CREATE TABLE `authors` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text
);
--> statement-breakpoint
CREATE TABLE `commit_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`commit_hash` text,
	`path` text NOT NULL,
	`change_type` text,
	FOREIGN KEY (`commit_hash`) REFERENCES `commits`(`hash`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `commits` (
	`hash` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`author_email` text,
	`type` text,
	`module` text,
	`message` text NOT NULL,
	`full_message` text,
	`pr_number` integer,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_email`) REFERENCES `authors`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY DEFAULT '01KFH5DYYEWB0N2ZQA2P3BTQ2E' NOT NULL,
	`name` text NOT NULL,
	`url` text,
	`created_at` integer
);
