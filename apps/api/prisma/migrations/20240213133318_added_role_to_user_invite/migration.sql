/*
  Warnings:

  - Added the required column `role` to the `UserInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserInvite" ADD COLUMN     "role" "UserRoleType" NOT NULL;
