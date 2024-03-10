/*
  Warnings:

  - Added the required column `passwordResetExpires` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordResetToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetExpires" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "passwordResetToken" TEXT NOT NULL;
