CREATE TABLE `stripe_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stripePaymentIntentId` varchar(100) NOT NULL,
	`stripeSessionId` varchar(100),
	`bookletRequestId` int,
	`appointmentId` int,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'eur',
	`productType` enum('booklet','appointment') NOT NULL,
	`status` enum('pending','succeeded','failed','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`customerEmail` varchar(320) NOT NULL,
	`customerName` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stripe_payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `stripe_payments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
