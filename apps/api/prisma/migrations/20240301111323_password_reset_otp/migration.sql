/*
  Warnings:

  - The primary key for the `ApiKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ApiKey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("api_key");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetOtp" TEXT;
