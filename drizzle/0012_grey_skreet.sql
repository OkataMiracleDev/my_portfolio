CREATE TABLE `plugin_purchases` (
	`reference` text PRIMARY KEY NOT NULL,
	`plugin_id` text NOT NULL,
	`email` text NOT NULL,
	`amount_paid` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`download_token` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`plugin_id`) REFERENCES `studio_plugins`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plugin_purchases_download_token_unique` ON `plugin_purchases` (`download_token`);--> statement-breakpoint
CREATE TABLE `studio_plugins` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`thumbnail_url` text NOT NULL,
	`file_url` text NOT NULL,
	`price_amount` integer NOT NULL,
	`pwyw_enabled` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `studio_plugins_slug_unique` ON `studio_plugins` (`slug`);