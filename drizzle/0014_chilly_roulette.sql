CREATE TABLE `rate_addons` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_retainer_tiers` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`tagline` text NOT NULL,
	`monthly` integer NOT NULL,
	`features` text DEFAULT '[]' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_services` (
	`id` text PRIMARY KEY NOT NULL,
	`timecode` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`price` text NOT NULL,
	`unit` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_terms` (
	`id` text PRIMARY KEY NOT NULL,
	`body` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
