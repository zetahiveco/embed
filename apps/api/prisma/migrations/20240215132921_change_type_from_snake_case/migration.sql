/*
  Warnings:

  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `organizationId` on the `Member` table. All the data in the column will be lost.
  - Added the required column `organization_id` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_organizationId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP CONSTRAINT "Member_pkey",
DROP COLUMN "organizationId",
ADD COLUMN     "organization_id" TEXT NOT NULL,
ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("organization_id", "user_id");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
