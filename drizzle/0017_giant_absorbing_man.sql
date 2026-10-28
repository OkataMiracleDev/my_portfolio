CREATE TABLE `brief_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`brief_type` text NOT NULL,
	`brief_label` text NOT NULL,
	`subject_name` text NOT NULL,
	`answers` text NOT NULL,
	`selected_package` text,
	`selected_price` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
