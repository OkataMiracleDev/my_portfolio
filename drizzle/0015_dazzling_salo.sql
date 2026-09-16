CREATE TABLE `retainer_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`company` text,
	`notes` text,
	`status` text DEFAULT 'active' NOT NULL,
	`share_token` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `retainer_clients_share_token_unique` ON `retainer_clients` (`share_token`);--> statement-breakpoint
CREATE TABLE `retainer_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`retainer_client_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`phase` text DEFAULT 'scripting' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `retainer_updates` (
	`id` text PRIMARY KEY NOT NULL,
	`retainer_project_id` text NOT NULL,
	`phase` text NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`images` text DEFAULT '[]' NOT NULL,
	`video_embed_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
