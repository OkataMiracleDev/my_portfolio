CREATE TABLE `site_visits` (
	`id` text PRIMARY KEY NOT NULL,
	`visit_date` text NOT NULL,
	`route` text NOT NULL,
	`ip_hash` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_visits_unique_visit` ON `site_visits` (`visit_date`,`route`,`ip_hash`);