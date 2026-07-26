CREATE TABLE `dev_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`subhead` text,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`image2` text,
	`image3` text,
	`technology` text DEFAULT '[]' NOT NULL,
	`date` text,
	`type` text,
	`client` text,
	`link` text,
	`featured_on_home` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dev_projects_slug_unique` ON `dev_projects` (`slug`);--> statement-breakpoint
CREATE TABLE `experience_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`year` text NOT NULL,
	`role` text NOT NULL,
	`company` text NOT NULL,
	`description` text NOT NULL,
	`technologies` text DEFAULT '[]' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fun_fact_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `motion_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`thumbnail` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`video_embed_url` text,
	`process` text NOT NULL,
	`tools` text DEFAULT '[]' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `motion_projects_slug_unique` ON `motion_projects` (`slug`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`route` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`cover_image` text,
	`body_markdown` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`published_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE TABLE `resources` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`file_url` text,
	`external_url` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`published_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resources_slug_unique` ON `resources` (`slug`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`route` text NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`quote` text NOT NULL,
	`avatar` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
