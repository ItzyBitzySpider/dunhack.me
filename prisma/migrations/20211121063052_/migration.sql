-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `session_state` VARCHAR(191) NULL,
    `oauth_token_secret` VARCHAR(191) NULL,
    `oauth_token` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `points` INTEGER NOT NULL DEFAULT 0,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `competing` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `added` DATETIME(3) NOT NULL,
    `added_by` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `exposed` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `challenges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `added` DATETIME(3) NOT NULL,
    `added_by` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` SMALLINT UNSIGNED NOT NULL,
    `description` TEXT NOT NULL,
    `exposed` BOOLEAN NOT NULL DEFAULT true,
    `available_from` DATETIME(3) NOT NULL,
    `available_until` DATETIME(3) NOT NULL,
    `flag` TEXT NOT NULL,
    `case_insensitive` BOOLEAN NOT NULL DEFAULT false,
    `automark` BOOLEAN NOT NULL DEFAULT true,
    `points` INTEGER NOT NULL,
    `solves` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `num_attempts_allowed` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `min_seconds_btwn_submissions` SMALLINT UNSIGNED NOT NULL DEFAULT 5,
    `relies_on` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hints` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `challenge` INTEGER UNSIGNED NOT NULL,
    `added` DATETIME(3) NOT NULL,
    `added_by` VARCHAR(191) NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT false,
    `body` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `added` DATETIME(3) NOT NULL,
    `added_by` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_whitelist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,

    UNIQUE INDEX `email_whitelist_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `added` DATETIME(3) NOT NULL,
    `challenge` INTEGER UNSIGNED NOT NULL,
    `user_id` INTEGER UNSIGNED NOT NULL,
    `flag` TEXT NOT NULL,
    `correct` BOOLEAN NOT NULL DEFAULT false,
    `marked` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
