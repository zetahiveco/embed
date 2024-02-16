/*
  Warnings:

  - You are about to drop the column `chart_type` on the `Visualization` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ChartType" ADD VALUE 'KPI_VIEW';

-- AlterTable
ALTER TABLE "Visualization" DROP COLUMN "chart_type";

-- CreateTable
CREATE TABLE "Render" (
    "id" TEXT NOT NULL,
    "chart_type" "ChartType" NOT NULL,
    "visualization_id" TEXT NOT NULL,
    "format" JSONB NOT NULL,

    CONSTRAINT "Render_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Render_visualization_id_key" ON "Render"("visualization_id");

-- AddForeignKey
ALTER TABLE "Render" ADD CONSTRAINT "Render_visualization_id_fkey" FOREIGN KEY ("visualization_id") REFERENCES "Visualization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
