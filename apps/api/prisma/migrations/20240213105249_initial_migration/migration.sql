-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('BIG_QUERY', 'SQL_SERVER', 'MYSQL', 'TIMESCALE', 'SUPABASE', 'CUBE', 'CRATE_DB', 'COCKROACH_DB', 'SINGLE_STORE', 'MATERIALIZE', 'POSTGRESQL', 'AWS_REDSHIT', 'SNOWFLAKE', 'ROCKSET', 'CLICKHOUSE');

-- CreateEnum
CREATE TYPE "ChartType" AS ENUM ('BAR_CHART', 'LINE_CHART', 'TABLE_VIEW', 'PIE_CHART');

-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRoleType" NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "integration_mechanism" "IntegrationType" NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "database" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visualization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chart_type" "ChartType" NOT NULL,
    "datasource_id" TEXT NOT NULL,
    "plain_sql" TEXT NOT NULL,

    CONSTRAINT "Visualization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secret" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Secret_api_key_key" ON "Secret"("api_key");

-- AddForeignKey
ALTER TABLE "Visualization" ADD CONSTRAINT "Visualization_datasource_id_fkey" FOREIGN KEY ("datasource_id") REFERENCES "DataSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
