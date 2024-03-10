-- AlterTable
ALTER TABLE "User" ALTER COLUMN "passwordResetExpires" DROP NOT NULL,
ALTER COLUMN "passwordResetToken" DROP NOT NULL;
