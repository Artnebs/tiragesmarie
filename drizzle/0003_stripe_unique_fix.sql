-- Fix stripe_payments table:
-- 1. stripePaymentIntentId becomes nullable (checkout sessions don't have a PI yet)
-- 2. stripeSessionId becomes NOT NULL UNIQUE (it's the true business key at creation time)
ALTER TABLE `stripe_payments` MODIFY COLUMN `stripePaymentIntentId` varchar(100);
--> statement-breakpoint
ALTER TABLE `stripe_payments` MODIFY COLUMN `stripeSessionId` varchar(100) NOT NULL;
--> statement-breakpoint
ALTER TABLE `stripe_payments` ADD CONSTRAINT `stripe_payments_stripeSessionId_unique` UNIQUE(`stripeSessionId`);
