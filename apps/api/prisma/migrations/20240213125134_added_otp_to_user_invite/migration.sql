/*
  Warnings:

  - Added the required column `otp` to the `UserInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserInvite" ADD COLUMN     "otp" TEXT NOT NULL;
