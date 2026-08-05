CREATE TABLE `client_updates` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`title` text NOT NULL,
	`body` text,
	`images` text DEFAULT '[]' NOT NULL,
	`video_embed_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`company` text,
	`stage` text DEFAULT 'lead' NOT NULL,
	`notes` text,
	`share_token` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clients_share_token_unique` ON `clients` (`share_token`);--> statement-breakpoint
CREATE TABLE `rate_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text,
	`title` text NOT NULL,
	`line_items` text DEFAULT '[]' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonial_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`project` text,
	`problem` text,
	`process` text,
	`result` text,
	`quote` text,
	`consent` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
