ALTER TABLE `rate_cards` ADD `layout` text DEFAULT 'flat' NOT NULL;--> statement-breakpoint
ALTER TABLE `rate_cards` ADD `currency` text DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE `rate_cards` ADD `terms` text DEFAULT '[]' NOT NULL;