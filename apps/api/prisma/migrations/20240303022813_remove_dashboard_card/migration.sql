/*
  Warnings:

  - You are about to drop the `DashboardCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DashboardCard" DROP CONSTRAINT "DashboardCard_dashboard_id_fkey";

-- DropForeignKey
ALTER TABLE "DashboardCard" DROP CONSTRAINT "DashboardCard_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "DashboardCard" DROP CONSTRAINT "DashboardCard_visualization_id_fkey";

-- DropTable
DROP TABLE "DashboardCard";
