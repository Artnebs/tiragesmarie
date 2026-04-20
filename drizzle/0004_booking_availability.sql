-- Phase 2C: availability tables + appointment index
-- Migration: 0004_booking_availability
-- NOTE: 0003_* is reserved for the Stripe agent's worktree to avoid merge collision.

--> statement-breakpoint
CREATE TABLE `availability_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`slotDurationMin` int NOT NULL DEFAULT 90,
	`isActive` int unsigned NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `availability_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `availability_blocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`startAt` datetime NOT NULL,
	`endAt` datetime NOT NULL,
	`reason` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `availability_blocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
-- Index on appointmentDate for conflict-check queries (no unique — cancelled rows must coexist)
CREATE INDEX `appointments_appointmentDate_idx` ON `appointments` (`appointmentDate`);
