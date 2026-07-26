CREATE TABLE `login_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`ip_address` text NOT NULL,
	`attempted_at` integer DEFAULT (unixepoch()) NOT NULL,
	`success` integer DEFAULT false NOT NULL
);
