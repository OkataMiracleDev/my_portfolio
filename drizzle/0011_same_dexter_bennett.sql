CREATE TABLE `brandmydell_bids` (
	`id` text PRIMARY KEY NOT NULL,
	`spot_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`bidder` text NOT NULL,
	`email` text NOT NULL,
	`at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`spot_id`) REFERENCES `brandmydell_spots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `brandmydell_payments` (
	`reference` text PRIMARY KEY NOT NULL,
	`spot_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`bidder` text NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `brandmydell_spots` (
	`id` integer PRIMARY KEY NOT NULL,
	`position` text NOT NULL,
	`label` text NOT NULL,
	`size` text NOT NULL,
	`dimensions_w` real NOT NULL,
	`dimensions_h` real NOT NULL,
	`dimensions_unit` text DEFAULT 'cm' NOT NULL,
	`premium` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'live' NOT NULL,
	`current_bid` integer DEFAULT 0 NOT NULL,
	`current_bidder` text,
	`bid_count` integer DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
