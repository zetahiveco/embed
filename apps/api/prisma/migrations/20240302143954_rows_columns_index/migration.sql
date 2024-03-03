/*
  Warnings:

  - The `layout` column on the `Dashboard` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `gridIdentifier` on the `DashboardCard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Dashboard" DROP COLUMN "layout",
ADD COLUMN     "layout" JSONB;

-- AlterTable
ALTER TABLE "DashboardCard" DROP COLUMN "gridIdentifier",
ADD COLUMN     "column" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "row" INTEGER NOT NULL DEFAULT 1;
