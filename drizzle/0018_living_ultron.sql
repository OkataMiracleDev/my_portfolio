CREATE TABLE `clippro_events` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`type` text NOT NULL,
	`surface` text NOT NULL,
	`label` text,
	`value` integer,
	`session_id` text NOT NULL,
	`visitor_hash` text NOT NULL,
	`path` text,
	`referrer` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`country` text,
	`device` text,
	`browser` text,
	`os` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `clippro_events_day` ON `clippro_events` (`day`);--> statement-breakpoint
CREATE INDEX `clippro_events_type_day` ON `clippro_events` (`type`,`day`);