CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`appointmentDate` datetime NOT NULL,
	`message` text,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `article_tags` (
	`articleId` int NOT NULL,
	`tagId` int NOT NULL,
	CONSTRAINT `article_tags_articleId_tagId_pk` PRIMARY KEY(`articleId`,`tagId`)
);
--> statement-breakpoint
CREATE TABLE `astro_houses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`houseNumber` int NOT NULL,
	`meaning` longtext,
	`influence` longtext,
	`interpretation` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `astro_houses_id` PRIMARY KEY(`id`),
	CONSTRAINT `astro_houses_houseNumber_unique` UNIQUE(`houseNumber`)
);
--> statement-breakpoint
CREATE TABLE `astro_planets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`symbol` varchar(10),
	`meaning` longtext,
	`influence` longtext,
	`interpretation` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `astro_planets_id` PRIMARY KEY(`id`),
	CONSTRAINT `astro_planets_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `astro_signs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`symbol` varchar(10),
	`element` varchar(20),
	`description` longtext,
	`strengths` longtext,
	`challenges` longtext,
	`advice` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `astro_signs_id` PRIMARY KEY(`id`),
	CONSTRAINT `astro_signs_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `blog_articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`content` longtext NOT NULL,
	`excerpt` varchar(500),
	`metaDescription` varchar(160),
	`keywords` varchar(255),
	`ogImage` varchar(500),
	`categoryId` int,
	`authorId` int,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `booklet_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`dateOfBirth` date NOT NULL,
	`timeOfBirth` time NOT NULL,
	`placeOfBirth` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`message` text,
	`status` enum('pending','generated','sent','completed') NOT NULL DEFAULT 'pending',
	`generatedBookletId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booklet_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booklet_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`section` varchar(50) NOT NULL,
	`content` longtext,
	`order` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booklet_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generated_booklets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookletRequestId` int NOT NULL,
	`sunSign` varchar(50),
	`moonSign` varchar(50),
	`ascendant` varchar(50),
	`documentUrl` varchar(500),
	`documentFormat` enum('pdf','pptx') NOT NULL DEFAULT 'pdf',
	`contentData` json,
	`status` enum('draft','ready','sent','downloaded') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generated_booklets_id` PRIMARY KEY(`id`)
);
