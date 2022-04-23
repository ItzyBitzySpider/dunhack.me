/*
  Warnings:

  - Made the column `hash` on table `challenges` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET DEFAULT CONCAT('User',SUBSTRING((gen_random_uuid()::TEXT),1,4));

-- AlterTable
ALTER TABLE "challenges" ALTER COLUMN "hash" SET NOT NULL;
