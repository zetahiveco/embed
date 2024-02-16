/*
  Warnings:

  - The primary key for the `Render` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Render` table. All the data in the column will be lost.
  - Added the required column `organization_id` to the `Render` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Render" DROP CONSTRAINT "Render_pkey",
DROP COLUMN "id",
ADD COLUMN     "organization_id" TEXT NOT NULL,
ADD CONSTRAINT "Render_pkey" PRIMARY KEY ("visualization_id", "organization_id");

-- AddForeignKey
ALTER TABLE "Render" ADD CONSTRAINT "Render_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
