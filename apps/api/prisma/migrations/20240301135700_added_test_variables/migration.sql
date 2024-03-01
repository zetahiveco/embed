/*
  Warnings:

  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_organization_id_fkey";

-- DropTable
DROP TABLE "Application";

-- CreateTable
CREATE TABLE "TestVariable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "TestVariable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestVariable" ADD CONSTRAINT "TestVariable_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
