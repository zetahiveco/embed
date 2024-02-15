/*
  Warnings:

  - You are about to drop the column `created_at` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `integration_mechanism` on the `DataSource` table. All the data in the column will be lost.
  - The primary key for the `Member` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `organization_id` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `UserInvite` table. All the data in the column will be lost.
  - You are about to drop the column `datasource_id` on the `Visualization` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integrationType` to the `DataSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `UserInvite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Visualization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "Visualization" DROP CONSTRAINT "Visualization_datasource_id_fkey";

-- DropForeignKey
ALTER TABLE "Visualization" DROP CONSTRAINT "Visualization_organization_id_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DataSource" DROP COLUMN "integration_mechanism",
ADD COLUMN     "integrationType" "IntegrationType" NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP CONSTRAINT "Member_pkey",
DROP COLUMN "organization_id",
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("organizationId", "user_id");

-- AlterTable
ALTER TABLE "UserInvite" DROP COLUMN "expiresAt",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Visualization" DROP COLUMN "datasource_id",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visualization" ADD CONSTRAINT "Visualization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "DataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visualization" ADD CONSTRAINT "Visualization_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
