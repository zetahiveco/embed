/*
  Warnings:

  - Added the required column `name` to the `DashboardCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN     "layout" JSONB;

-- AlterTable
ALTER TABLE "DashboardCard" ADD COLUMN     "name" TEXT NOT NULL;
