-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET DEFAULT CONCAT('User',SUBSTRING((gen_random_uuid()::TEXT),1,4));
