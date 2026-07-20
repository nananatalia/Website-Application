/*
  Warnings:

  - You are about to drop the column `macAddress` on the `Device` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Device_macAddress_key";

-- AlterTable
ALTER TABLE "ColorPreset" ADD COLUMN     "analyzerBrightness" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "clock" TEXT NOT NULL DEFAULT '#ffffff',
ADD COLUMN     "clockBrightness" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "macAddress";
